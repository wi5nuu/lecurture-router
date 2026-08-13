import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    return NextResponse.json({
      message: user
        ? "Link reset password telah dikirim ke email Anda"
        : "Jika email terdaftar, link reset password akan dikirim",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
