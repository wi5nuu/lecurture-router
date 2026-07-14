import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, status } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM User WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const hashedPassword = hashPassword(password);
    db.prepare(
      "INSERT INTO User (id, email, password, firstName, lastName, status) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, email, hashedPassword, firstName, lastName, status || "Mahasiswa S1");

    const token = generateToken(id);

    return NextResponse.json({
      token,
      user: { id, email, firstName, lastName, status: status || "Mahasiswa S1" },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
