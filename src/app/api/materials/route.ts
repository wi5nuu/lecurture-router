import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const offset = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const format = searchParams.get("format") || "";
    const level = searchParams.get("level") || "";
    const price = searchParams.get("price") || "";
    const sort = searchParams.get("sort") || "rating";
    const provider = searchParams.get("provider") || "";

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ? OR instructor LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push("categoryId = ?");
      params.push(category);
    }
    if (format) {
      conditions.push("format = ?");
      params.push(format);
    }
    if (level) {
      conditions.push("level = ?");
      params.push(level);
    }
    if (price) {
      conditions.push("price = ?");
      params.push(price);
    }
    if (provider) {
      conditions.push("providerId = ?");
      params.push(provider);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderMap: Record<string, string> = {
      rating: "rating DESC",
      newest: "year DESC",
      oldest: "year ASC",
      title: "title ASC",
      reviews: "reviewCount DESC",
      citations: "citations DESC",
    };
    const orderBy = orderMap[sort] || "rating DESC";

    const countRow = db.prepare(
      `SELECT COUNT(*) as total FROM Material ${where}`
    ).get(...params) as { total: number };

    const rows = db.prepare(
      `SELECT * FROM Material ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).all(...params, limit, offset) as Array<Record<string, unknown>>;

    const materials = rows.map((row) => ({
      ...row,
      tags: JSON.parse(row.tags as string),
    }));

    return NextResponse.json({
      materials,
      pagination: {
        page,
        limit,
        total: countRow.total,
        totalPages: Math.ceil(countRow.total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
