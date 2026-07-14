import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare("SELECT id FROM User WHERE email = ?").get(email);

    return NextResponse.json({
      message: user
        ? "Link reset password telah dikirim ke email Anda"
        : "Jika email terdaftar, link reset password akan dikirim",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
