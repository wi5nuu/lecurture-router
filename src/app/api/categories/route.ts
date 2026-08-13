import { NextResponse } from "next/server";
import { listCategories } from "@/lib/firestore";
import { FirebaseNotConfiguredError } from "@/lib/firebase";

export async function GET() {
  try {
    const rows = await listCategories();
    return NextResponse.json({ categories: rows });
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to list categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}