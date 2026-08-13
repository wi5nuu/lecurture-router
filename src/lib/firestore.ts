import {
  FieldValue,
  type DocumentData,
  type Query,
} from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured, FirebaseNotConfiguredError } from "./firebase";

const COLLECTION_MATERIALS = "materials";
const COLLECTION_PROVIDERS = "providers";
const COLLECTION_CATEGORIES = "categories";

const MAX_SCAN_DOCS = 1000;

export interface FirestoreCategory {
  id: string;
  name: string;
  icon: string;
  materialCount: number;
  description: string;
  color: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  totalMaterials: number;
  formats: string[];
  languages: string[];
  priceModel: string;
  rating: number;
  url: string;
  categories: string[];
  established: number;
  headquarters: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreMaterial {
  id: string;
  title: string;
  source: string;
  providerId: string;
  providerName: string;
  providerLogo?: string | null;
  course: string;
  format: string;
  language: string;
  level: string;
  year: number;
  rating: number;
  reviewCount: number;
  price: string;
  accessUrl: string;
  description: string;
  fullContent: string;
  categoryId: string;
  categoryName: string;
  instructor: string;
  university: string;
  citations: number;
tags: string[];
  thumbnail?: string | null;
  pages?: number | null;
  duration?: string | null;
  isbn?: string | null;
  doi?: string | null;
  viewCount: number;
  downloadCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MaterialListSort =
  | "rating"
  | "newest"
  | "oldest"
  | "title"
  | "reviews"
  | "citations";

export interface MaterialListOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  format?: string;
  level?: string;
  price?: string;
  provider?: string;
  sort?: MaterialListSort;
  includeUnpublished?: boolean;
}

export interface MaterialListResult {
  materials: FirestoreMaterial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function requireFirestore() {
  if (!isFirebaseConfigured()) {
    throw new FirebaseNotConfiguredError();
  }
  return getDb();
}

function docToData<T extends { id: string }>(id: string, data: DocumentData): T {
  return { id, ...data } as T;
}

function withTimestamps<T extends object>(data: T) {
  const now = new Date();
  return { ...data, createdAt: now, updatedAt: now } as T & {
    createdAt: Date;
    updatedAt: Date;
  };
}

export async function listMaterials(
  options: MaterialListOptions = {}
): Promise<MaterialListResult> {
  const db = requireFirestore();
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 12));
  const sort: MaterialListSort = options.sort ?? "rating";

  let query: Query = db.collection(COLLECTION_MATERIALS);

  if (options.category) query = query.where("categoryId", "==", options.category);
  if (options.format) query = query.where("format", "==", options.format);
  if (options.level) query = query.where("level", "==", options.level);
  if (options.price) query = query.where("price", "==", options.price);
  if (options.provider) query = query.where("providerId", "==", options.provider);
  if (!options.includeUnpublished) query = query.where("isPublished", "==", true);

  const snapshot = await query.limit(MAX_SCAN_DOCS).get();
  const all = snapshot.docs.map((doc) =>
    docToData<FirestoreMaterial>(doc.id, doc.data())
  );

  const searchTerm = options.search?.trim().toLowerCase();
  let filtered = all;
  if (searchTerm) {
    filtered = all.filter(
      (m) =>
        m.title.toLowerCase().includes(searchTerm) ||
        m.description.toLowerCase().includes(searchTerm) ||
        m.instructor.toLowerCase().includes(searchTerm) ||
        m.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  filtered.sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.year - a.year || b.createdAt.getTime() - a.createdAt.getTime();
      case "oldest":
        return a.year - b.year || a.createdAt.getTime() - b.createdAt.getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "citations":
        return b.citations - a.citations;
      default:
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
    }
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const materials = filtered.slice(startIndex, startIndex + limit);

  return {
    materials,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getMaterialById(
  id: string
): Promise<FirestoreMaterial | null> {
  const db = requireFirestore();
  const doc = await db.collection(COLLECTION_MATERIALS).doc(id).get();
  if (!doc.exists) return null;
  return docToData<FirestoreMaterial>(doc.id, doc.data()!);
}

export async function getMaterialWithRelated(
  id: string,
  relatedLimit = 6
): Promise<{ material: FirestoreMaterial; related: FirestoreMaterial[] } | null> {
  const material = await getMaterialById(id);
  if (!material) return null;

  const db = requireFirestore();
  const snapshot = await db
    .collection(COLLECTION_MATERIALS)
    .where("categoryId", "==", material.categoryId)
    .where("isPublished", "==", true)
    .limit(MAX_SCAN_DOCS)
    .get();

  const related = snapshot.docs
    .map((doc) => docToData<FirestoreMaterial>(doc.id, doc.data()))
    .filter((m) => m.id !== id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, relatedLimit);

  return { material, related };
}

export async function getMaterialsByIds(
  ids: string[]
): Promise<FirestoreMaterial[]> {
  if (ids.length === 0) return [];
  const db = requireFirestore();
  const uniqIds = Array.from(new Set(ids));
  const results: FirestoreMaterial[] = [];
  const batchSize = 10;

  for (let i = 0; i < uniqIds.length; i += batchSize) {
    const chunk = uniqIds.slice(i, i + batchSize);
    const snapshot = await db
      .collection(COLLECTION_MATERIALS)
      .where("__name__", "in", chunk)
      .get();
    results.push(
      ...snapshot.docs.map((doc) =>
        docToData<FirestoreMaterial>(doc.id, doc.data())
      )
    );
  }

  return results;
}

export async function getAllMaterials(): Promise<FirestoreMaterial[]> {
  const db = requireFirestore();
  const snapshot = await db.collection(COLLECTION_MATERIALS).get();
  return snapshot.docs.map((doc) =>
    docToData<FirestoreMaterial>(doc.id, doc.data())
  );
}

export async function countMaterials(): Promise<number> {
  const db = requireFirestore();
  const snapshot = await db.collection(COLLECTION_MATERIALS).count().get();
  return snapshot.data().count;
}

export async function getMaterialsByProvider(
  providerId: string
): Promise<FirestoreMaterial[]> {
  const db = requireFirestore();
  const snapshot = await db
    .collection(COLLECTION_MATERIALS)
    .where("providerId", "==", providerId)
    .get();
  return snapshot.docs
    .map((doc) => docToData<FirestoreMaterial>(doc.id, doc.data()))
    .sort((a, b) => b.rating - a.rating);
}

export interface MaterialInput {
  title: string;
  source: string;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  course: string;
  format: string;
  language: string;
  level: string;
  year: number;
  rating?: number;
  reviewCount?: number;
  price: string;
  accessUrl: string;
  description: string;
  fullContent?: string;
  categoryId: string;
  categoryName: string;
  instructor?: string;
  university?: string;
  citations?: number;
  tags?: string[];
  thumbnail?: string;
  pages?: number;
  duration?: string;
  isbn?: string;
  doi?: string;
  isPublished?: boolean;
}

export interface MaterialMutationResult {
  id: string;
  material: FirestoreMaterial;
}

export async function createMaterial(
  id: string | undefined,
  input: MaterialInput
): Promise<MaterialMutationResult> {
  const db = requireFirestore();
  const docRef = id
    ? db.collection(COLLECTION_MATERIALS).doc(id)
    : db.collection(COLLECTION_MATERIALS).doc();

  const createdAt = new Date();
  const data = {
    title: input.title,
    source: input.source,
    providerId: input.providerId,
    providerName: input.providerName,
    providerLogo: input.providerLogo ?? null,
    course: input.course,
    format: input.format,
    language: input.language,
    level: input.level,
    year: input.year,
    rating: input.rating ?? 0,
    reviewCount: input.reviewCount ?? 0,
    price: input.price,
    accessUrl: input.accessUrl,
    description: input.description,
    fullContent: input.fullContent ?? "",
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    instructor: input.instructor ?? "",
    university: input.university ?? "",
    citations: input.citations ?? 0,
    tags: input.tags ?? [],
    thumbnail: input.thumbnail ?? null,
    pages: input.pages ?? null,
    duration: input.duration ?? null,
    isbn: input.isbn ?? null,
    doi: input.doi ?? null,
    viewCount: 0,
    downloadCount: 0,
    isPublished: input.isPublished ?? true,
    createdAt,
    updatedAt: createdAt,
  };

  await docRef.set(data);
  return { id: docRef.id, material: { id: docRef.id, ...data } };
}

export async function updateMaterial(
  id: string,
  input: Partial<MaterialInput>
): Promise<FirestoreMaterial | null> {
  const db = requireFirestore();
  const docRef = db.collection(COLLECTION_MATERIALS).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const data = { ...input, updatedAt: new Date() };
  await docRef.update(data as DocumentData);

  const updated = await docRef.get();
  return docToData<FirestoreMaterial>(id, updated.data()!);
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const db = requireFirestore();
  const doc = await db.collection(COLLECTION_MATERIALS).doc(id).get();
  if (!doc.exists) return false;
  await db.collection(COLLECTION_MATERIALS).doc(id).delete();
  return true;
}

export async function incrementMaterialViews(id: string): Promise<void> {
  const db = requireFirestore();
  await db
    .collection(COLLECTION_MATERIALS)
    .doc(id)
    .update({ viewCount: FieldValue.increment(1) });
}

export async function listCategories(): Promise<FirestoreCategory[]> {
  const db = requireFirestore();
  const snapshot = await db.collection(COLLECTION_CATEGORIES).get();
  return snapshot.docs
    .map((doc) => docToData<FirestoreCategory>(doc.id, doc.data()))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryById(
  id: string
): Promise<FirestoreCategory | null> {
  const db = requireFirestore();
  const doc = await db.collection(COLLECTION_CATEGORIES).doc(id).get();
  if (!doc.exists) return null;
  return docToData<FirestoreCategory>(doc.id, doc.data()!);
}

export interface CategoryInput {
  name: string;
  icon: string;
  materialCount?: number;
  description: string;
  color: string;
  slug?: string;
  isActive?: boolean;
}

export async function createCategory(
  id: string | undefined,
  input: CategoryInput
): Promise<FirestoreCategory> {
  const db = requireFirestore();
  const docRef = id
    ? db.collection(COLLECTION_CATEGORIES).doc(id)
    : db.collection(COLLECTION_CATEGORIES).doc();

  const data = withTimestamps({
    name: input.name,
    icon: input.icon,
    materialCount: input.materialCount ?? 0,
    description: input.description,
    color: input.color,
    slug:
      input.slug ?? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    isActive: input.isActive ?? true,
  });

  await docRef.set(data);
  return { id: docRef.id, ...data };
}

export interface ProviderListOptions {
  search?: string;
  price?: string;
  sort?: "rating" | "materials" | "name" | "newest";
}

export async function listProviders(
  options: ProviderListOptions = {}
): Promise<FirestoreProvider[]> {
  const db = requireFirestore();
  const snapshot = await db.collection(COLLECTION_PROVIDERS).get();
  let providers = snapshot.docs.map((doc) =>
    docToData<FirestoreProvider>(doc.id, doc.data())
  );

  const searchTerm = options.search?.trim().toLowerCase();
  if (searchTerm) {
    providers = providers.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
  }
  if (options.price) {
    providers = providers.filter((p) => p.priceModel === options.price);
  }

  const sort = options.sort ?? "rating";
  providers.sort((a, b) => {
    switch (sort) {
      case "materials":
        return b.totalMaterials - a.totalMaterials;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return b.established - a.established;
      default:
        return b.rating - a.rating || b.totalMaterials - a.totalMaterials;
    }
  });

  return providers;
}

export async function getProviderById(
  id: string
): Promise<FirestoreProvider | null> {
  const db = requireFirestore();
  const doc = await db.collection(COLLECTION_PROVIDERS).doc(id).get();
  if (!doc.exists) return null;
  return docToData<FirestoreProvider>(doc.id, doc.data()!);
}

export async function getProviderWithMaterials(
  id: string
): Promise<{ provider: FirestoreProvider; materials: FirestoreMaterial[] } | null> {
  const provider = await getProviderById(id);
  if (!provider) return null;
  const materials = await getMaterialsByProvider(id);
  return { provider, materials };
}

export interface ProviderInput {
  name: string;
  logo: string;
  description: string;
  totalMaterials?: number;
  formats?: string[];
  languages?: string[];
  priceModel: string;
  rating?: number;
  url: string;
  categories?: string[];
  established: number;
  headquarters: string;
  isActive?: boolean;
}

export async function createProvider(
  id: string | undefined,
  input: ProviderInput
): Promise<FirestoreProvider> {
  const db = requireFirestore();
  const docRef = id
    ? db.collection(COLLECTION_PROVIDERS).doc(id)
    : db.collection(COLLECTION_PROVIDERS).doc();

  const data = withTimestamps({
    name: input.name,
    logo: input.logo,
    description: input.description,
    totalMaterials: input.totalMaterials ?? 0,
    formats: input.formats ?? [],
    languages: input.languages ?? [],
    priceModel: input.priceModel,
    rating: input.rating ?? 0,
    url: input.url,
    categories: input.categories ?? [],
    established: input.established,
    headquarters: input.headquarters,
    isActive: input.isActive ?? true,
  });

  await docRef.set(data);
  return { id: docRef.id, ...data };
}

export async function updateProvider(
  id: string,
  input: Partial<ProviderInput>
): Promise<FirestoreProvider | null> {
  const db = requireFirestore();
  const docRef = db.collection(COLLECTION_PROVIDERS).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const data = { ...input, updatedAt: new Date() };
  await docRef.update(data as DocumentData);

  const updated = await docRef.get();
  return docToData<FirestoreProvider>(id, updated.data()!);
}

export async function deleteProvider(id: string): Promise<boolean> {
  const db = requireFirestore();
  const doc = await db.collection(COLLECTION_PROVIDERS).doc(id).get();
  if (!doc.exists) return false;
  await db.collection(COLLECTION_PROVIDERS).doc(id).delete();
  return true;
}

export async function countProviders(): Promise<number> {
  const db = requireFirestore();
  const snapshot = await db.collection(COLLECTION_PROVIDERS).count().get();
  return snapshot.data().count;
}

export function isFirestoreMaterial(data: unknown): data is FirestoreMaterial {
  return (
    typeof data === "object" &&
    data !== null &&
    "title" in data &&
    "providerId" in data &&
    "categoryId" in data
  );
}