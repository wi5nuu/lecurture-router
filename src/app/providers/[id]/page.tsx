import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { providers, materials, type Provider, type Material } from "@/lib/data";
import { ProviderDetailClient } from "./client";
import { getProviderWithMaterials } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { toViewMaterial, toViewProvider } from "@/lib/adapters";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchProvider(
  id: string
): Promise<{ provider: Provider; materials: Material[] } | null> {
  if (isFirebaseConfigured()) {
    try {
      const result = await getProviderWithMaterials(id);
      if (result) {
        return {
          provider: toViewProvider(result.provider),
          materials: result.materials.map(toViewMaterial),
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch provider from Firestore:", error);
    }
  }

  const provider = providers.find((p) => p.id === id);
  if (!provider) return null;
  return {
    provider,
    materials: materials.filter((m) => m.provider === id),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchProvider(id);
  if (!result) return { title: "Provider Tidak Ditemukan" };
  return {
    title: result.provider.name,
    description: result.provider.description,
  };
}

export default async function ProviderDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await fetchProvider(id);
  if (!result) notFound();
  return (
    <ProviderDetailClient
      provider={result.provider}
      materials={result.materials}
    />
  );
}