import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare(
      "SELECT id, email, password, firstName, lastName, status FROM User WHERE email = ?"
    ).get(email) as { id: string; email: string; password: string; firstName: string; lastName: string; status: string } | undefined;

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    if (!comparePassword(password, user.password)) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, status: user.status },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
