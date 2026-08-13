import {
  categories as seedCategories,
  providers as seedProviders,
  materials as seedMaterials,
} from "../src/lib/data";
import {
  createCategory,
  createProvider,
  createMaterial,
  countMaterials,
} from "../src/lib/firestore";
import { isFirebaseConfigured, FirebaseNotConfiguredError } from "../src/lib/firebase";

async function seed() {
  console.log("Syncing catalog to Firebase Firestore...\n");

  if (!isFirebaseConfigured()) {
    throw new FirebaseNotConfiguredError();
  }

  console.log(`Seeding ${seedCategories.length} categories...`);
  for (const cat of seedCategories) {
    const category = await createCategory(cat.id, {
      name: cat.name,
      icon: cat.icon,
      materialCount: cat.materialCount,
      description: cat.description,
      color: cat.color,
      slug: cat.id,
    });
    console.log(`  - ${category.name}`);
  }

  console.log(`\nSeeding ${seedProviders.length} providers...`);
  for (const prov of seedProviders) {
    const provider = await createProvider(prov.id, {
      name: prov.name,
      logo: prov.logo,
      description: prov.description,
      totalMaterials: prov.totalMaterials,
      formats: prov.formats,
      languages: prov.languages,
      priceModel: prov.priceModel,
      rating: prov.rating,
      url: prov.url,
      categories: prov.categories,
      established: prov.established,
      headquarters: prov.headquarters,
    });
    console.log(`  - ${provider.name}`);
  }

  const categoryNameById = new Map(
    seedCategories.map((c) => [c.id, c.name])
  );
  const providerLogoById = new Map(
    seedProviders.map((p) => [p.id, p.logo])
  );

  console.log(`\nSeeding ${seedMaterials.length} materials...`);
  for (const mat of seedMaterials) {
    const material = await createMaterial(mat.id, {
      title: mat.title,
      source: mat.source,
      providerId: mat.provider,
      providerName: mat.source,
      providerLogo: providerLogoById.get(mat.provider),
      course: mat.course,
      format: mat.format,
      language: mat.language,
      level: mat.level,
      year: mat.year,
      rating: mat.rating,
      reviewCount: mat.reviewCount,
      price: mat.price,
      accessUrl: mat.accessUrl,
      description: mat.description,
      fullContent: mat.fullContent,
      categoryId: mat.category,
      categoryName: categoryNameById.get(mat.category) ?? mat.category,
      instructor: mat.instructor,
      university: mat.university,
      citations: mat.citations,
      tags: mat.tags,
      thumbnail: mat.thumbnail,
      pages: mat.pages,
      duration: mat.duration,
      isbn: mat.isbn,
      doi: mat.doi,
    });
    console.log(`  - ${material.material.title}`);
  }

  const total = await countMaterials();
  console.log(`\nSync complete! ${total} materials are now in Firestore.`);
  console.log("Project: " + process.env.FIREBASE_PROJECT_ID);
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Firebase seed failed:", e.message || e);
    process.exit(1);
  });