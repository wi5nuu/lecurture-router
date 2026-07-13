import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { materials } from "@/lib/data";
import { MaterialDetailClient } from "./client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const material = materials.find((m) => m.id === id);
  if (!material) return { title: "Materi Tidak Ditemukan" };
  return {
    title: material.title,
    description: material.description,
  };
}

export default async function MaterialDetailPage({ params }: Props) {
  const { id } = await params;
  const material = materials.find((m) => m.id === id);
  if (!material) notFound();
  return <MaterialDetailClient material={material} />;
}
