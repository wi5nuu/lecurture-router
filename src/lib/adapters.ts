import type { Material, Provider, Category } from "@/lib/data";
import type {
  FirestoreMaterial,
  FirestoreProvider,
  FirestoreCategory,
} from "@/lib/firestore";

export function toViewMaterial(m: FirestoreMaterial): Material {
  return {
    id: m.id,
    title: m.title,
    source: m.providerName,
    provider: m.providerId,
    course: m.course,
    format: m.format as Material["format"],
    language: m.language,
    level: m.level as Material["level"],
    year: m.year,
    rating: m.rating,
    reviewCount: m.reviewCount,
    price: m.price as Material["price"],
    accessUrl: m.accessUrl,
    description: m.description,
    fullContent: m.fullContent,
    category: m.categoryId,
    instructor: m.instructor,
    university: m.university,
    citations: m.citations,
    tags: m.tags ?? [],
    thumbnail: m.thumbnail ?? undefined,
    pages: m.pages ?? undefined,
    duration: m.duration ?? undefined,
    isbn: m.isbn ?? undefined,
    doi: m.doi ?? undefined,
  };
}

export function toApiMaterial(m: FirestoreMaterial) {
  return {
    ...m,
    tags: m.tags ?? [],
    category: m.categoryId,
    provider: m.providerId,
  };
}

export function toViewProvider(p: FirestoreProvider): Provider {
  return {
    id: p.id,
    name: p.name,
    logo: p.logo,
    description: p.description,
    totalMaterials: p.totalMaterials,
    formats: p.formats ?? [],
    languages: p.languages ?? [],
    priceModel: p.priceModel as Provider["priceModel"],
    rating: p.rating,
    url: p.url,
    categories: p.categories ?? [],
    established: p.established,
    headquarters: p.headquarters,
  };
}

export function toViewCategory(c: FirestoreCategory): Category {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon,
    materialCount: c.materialCount,
    description: c.description,
    color: c.color,
  };
}
