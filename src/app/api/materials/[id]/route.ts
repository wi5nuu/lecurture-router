import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const material = db.prepare("SELECT * FROM Material WHERE id = ?").get(id) as Record<string, unknown> | undefined;

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const provider = db.prepare("SELECT * FROM Provider WHERE id = ?").get(material.providerId);
    const category = db.prepare("SELECT * FROM Category WHERE id = ?").get(material.categoryId);

    const related = db.prepare(
      "SELECT * FROM Material WHERE categoryId = ? AND id != ? ORDER BY rating DESC LIMIT 6"
    ).all(material.categoryId, id) as Array<Record<string, unknown>>;

    return NextResponse.json({
      material: {
        ...material,
        tags: JSON.parse(material.tags as string),
        provider,
        category,
        relatedMaterials: related.map((r) => ({
          ...r,
          tags: JSON.parse(r.tags as string),
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
