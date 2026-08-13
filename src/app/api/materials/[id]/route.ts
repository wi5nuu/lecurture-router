import { NextRequest, NextResponse } from "next/server";
import {
  getMaterialWithRelated,
  incrementMaterialViews,
} from "@/lib/firestore";
import { FirebaseNotConfiguredError } from "@/lib/firebase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await getMaterialWithRelated(id);

    if (!result) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 },
      );
    }

    const { material, related } = result;

    const formattedMaterial = {
      ...material,
      tags: material.tags ?? [],
      provider: {
        id: material.providerId,
        name: material.providerName,
        logo: material.providerLogo ?? null,
      },
      category: {
        id: material.categoryId,
        name: material.categoryName,
      },
      relatedMaterials: related.map((r) => ({
        ...r,
        tags: r.tags ?? [],
        provider: {
          id: r.providerId,
          name: r.providerName,
          logo: r.providerLogo ?? null,
        },
      })),
    };

    void incrementMaterialViews(id).catch(() => {});

    return NextResponse.json({ material: formattedMaterial });
  } catch (error) {
    if (error instanceof FirebaseNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to fetch material:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
