import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { getMaterialsByIds, getMaterialById } from "@/lib/firestore";
import { FirebaseNotConfiguredError } from "@/lib/firebase";

function getUserFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const payload = verifyToken(authHeader.slice(7));
  return payload?.userId ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const firestoreMaterials = await getMaterialsByIds(
      bookmarks.map((b) => b.materialId),
    );
    const materialMap = new Map(firestoreMaterials.map((m) => [m.id, m]));

    const formattedBookmarks = bookmarks.map((b) => ({
      id: b.id,
      materialId: b.materialId,
      bookmarkedAt: b.createdAt,
      material: materialMap.get(b.materialId) ?? null,
    }));

    return NextResponse.json({ bookmarks: formattedBookmarks });
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to list bookmarks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId } = await request.json();
    if (!materialId) {
      return NextResponse.json(
        { error: "materialId wajib diisi" },
        { status: 400 },
      );
    }

    const material = await getMaterialById(materialId);
    if (!material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 },
      );
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_materialId: {
          userId,
          materialId,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Already bookmarked" },
        { status: 409 },
      );
    }

    const newBookmark = await prisma.bookmark.create({
      data: {
        userId,
        materialId,
      },
    });

    return NextResponse.json(
      { id: newBookmark.id, materialId },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to create bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
