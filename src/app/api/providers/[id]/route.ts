import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const provider = db.prepare("SELECT * FROM Provider WHERE id = ?").get(id) as Record<string, unknown> | undefined;

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const materials = db.prepare(
      "SELECT * FROM Material WHERE providerId = ? ORDER BY rating DESC"
    ).all(id) as Array<Record<string, unknown>>;

    return NextResponse.json({
      provider: {
        ...provider,
        formats: JSON.parse(provider.formats as string),
        languages: JSON.parse(provider.languages as string),
        categories: JSON.parse(provider.categories as string),
      },
      materials: materials.map((m) => ({
        ...m,
        tags: JSON.parse(m.tags as string),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
