import { NextRequest, NextResponse } from "next/server";
import { listMaterials, type MaterialListSort } from "@/lib/firestore";
import { FirebaseNotConfiguredError } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "12")),
    );
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const format = searchParams.get("format") || "";
    const level = searchParams.get("level") || "";
    const price = searchParams.get("price") || "";
    const sort = (searchParams.get("sort") || "rating") as MaterialListSort;
    const provider = searchParams.get("provider") || "";

    const result = await listMaterials({
      page,
      limit,
      search,
      category,
      format,
      level,
      price,
      provider,
      sort,
    });

    const materials = result.materials.map((m) => ({
      ...m,
      tags: m.tags ?? [],
      provider: {
        id: m.providerId,
        name: m.providerName,
        logo: m.providerLogo ?? null,
      },
      category: {
        id: m.categoryId,
        name: m.categoryName,
      },
    }));

    return NextResponse.json({
      materials,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to list materials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
