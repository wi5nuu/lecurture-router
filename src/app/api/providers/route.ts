import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const price = searchParams.get("price") || "";
    const sort = searchParams.get("sort") || "rating";

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      conditions.push("(name LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (price) {
      conditions.push("priceModel = ?");
      params.push(price);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderMap: Record<string, string> = {
      rating: "rating DESC",
      materials: "totalMaterials DESC",
      name: "name ASC",
      newest: "established DESC",
    };
    const orderBy = orderMap[sort] || "rating DESC";

    const rows = db.prepare(
      `SELECT * FROM Provider ${where} ORDER BY ${orderBy}`
    ).all(...params) as Array<Record<string, unknown>>;

    const providers = rows.map((row) => ({
      id: row.id,
      name: row.name,
      logo: row.logo,
      description: row.description,
      totalMaterials: row.totalMaterials,
      formats: JSON.parse(row.formats as string),
      languages: JSON.parse(row.languages as string),
      priceModel: row.priceModel,
      rating: row.rating,
      url: row.url,
      categories: JSON.parse(row.categories as string),
      established: row.established,
      headquarters: row.headquarters,
    }));

    return NextResponse.json({ providers });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
