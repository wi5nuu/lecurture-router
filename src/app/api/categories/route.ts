import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM Category ORDER BY name ASC").all();

    return NextResponse.json({ categories: rows });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
