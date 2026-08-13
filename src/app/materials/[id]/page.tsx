import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { materials, type Material } from "@/lib/data";
import { MaterialDetailClient } from "./client";
import { getMaterialWithRelated } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { toViewMaterial } from "@/lib/adapters";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchMaterial(
  id: string
): Promise<{ material: Material; related: Material[] } | null> {
  if (isFirebaseConfigured()) {
    try {
      const result = await getMaterialWithRelated(id);
      if (result) {
        return {
          material: toViewMaterial(result.material),
          related: result.related.map(toViewMaterial),
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch material from Firestore:", error);
    }
  }

  const material = materials.find((m) => m.id === id);
  if (!material) return null;
  const related = materials
    .filter((m) => m.category === material.category && m.id !== id)
    .slice(0, 6);
  return { material, related };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchMaterial(id);
  if (!result) return { title: "Materi Tidak Ditemukan" };
  return {
    title: result.material.title,
    description: result.material.description,
  };
}

export default async function MaterialDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await fetchMaterial(id);
  if (!result) notFound();
  return (
    <MaterialDetailClient
      material={result.material}
      related={result.related}
    />
  );
}