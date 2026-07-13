import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { providers, materials } from "@/lib/data";
import { ProviderDetailClient } from "./client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const provider = providers.find((p) => p.id === id);
  if (!provider) return { title: "Provider Tidak Ditemukan" };
  return {
    title: provider.name,
    description: provider.description,
  };
}

export default async function ProviderDetailPage({ params }: Props) {
  const { id } = await params;
  const provider = providers.find((p) => p.id === id);
  if (!provider) notFound();
  const providerMaterials = materials.filter((m) => m.provider === id);
  return <ProviderDetailClient provider={provider} materials={providerMaterials} />;
}
