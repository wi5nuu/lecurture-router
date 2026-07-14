import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function getUserFromToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const payload = verifyToken(authHeader.slice(7));
  return payload?.userId ?? null;
}

export async function GET(request: Request) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const rows = db.prepare(
      `SELECT b.id as bookmarkId, b.createdAt as bookmarkedAt, m.*
       FROM Bookmark b
       JOIN Material m ON m.id = b.materialId
       WHERE b.userId = ?
       ORDER BY b.createdAt DESC`
    ).all(userId) as Array<Record<string, unknown>>;

    const bookmarks = rows.map((row) => ({
      id: row.bookmarkId,
      bookmarkedAt: row.bookmarkedAt,
      material: {
        ...row,
        tags: JSON.parse(row.tags as string),
      },
    }));

    return NextResponse.json({ bookmarks });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId } = await request.json();
    if (!materialId) {
      return NextResponse.json({ error: "materialId wajib diisi" }, { status: 400 });
    }

    const db = getDb();
    const material = db.prepare("SELECT id FROM Material WHERE id = ?").get(materialId);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const existing = db.prepare(
      "SELECT id FROM Bookmark WHERE userId = ? AND materialId = ?"
    ).get(userId, materialId);
    if (existing) {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    db.prepare(
      "INSERT INTO Bookmark (id, userId, materialId) VALUES (?, ?, ?)"
    ).run(id, userId, materialId);

    return NextResponse.json({ id, materialId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
