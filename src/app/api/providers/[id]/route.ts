import { NextRequest, NextResponse } from "next/server";
import { getProviderWithMaterials } from "@/lib/firestore";
import { FirebaseNotConfiguredError } from "@/lib/firebase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await getProviderWithMaterials(id);

    if (!result) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 },
      );
    }

    const { provider, materials } = result;

    return NextResponse.json({
      provider,
      materials: materials.map((m) => ({
        ...m,
        tags: m.tags ?? [],
      })),
    });
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to fetch provider:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
