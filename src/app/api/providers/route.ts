import { NextRequest, NextResponse } from "next/server";
import { listProviders, type ProviderListOptions } from "@/lib/firestore";
import { FirebaseNotConfiguredError } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const price = searchParams.get("price") || "";
    const sort = (searchParams.get("sort") || "rating") as ProviderListOptions["sort"];

    const providers = await listProviders({ search, price, sort });

    return NextResponse.json({ providers });
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to list providers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}