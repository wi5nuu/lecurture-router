import Database from "better-sqlite3";
import path from "path";
import { categories, providers, materials } from "../src/lib/data";

const db = new Database(path.join(process.cwd(), "dev.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function seed() {
  console.log("Seeding database...");

  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO Category (id, name, icon, materialCount, description, color)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const cat of categories) {
    insertCategory.run(cat.id, cat.name, cat.icon, cat.materialCount, cat.description, cat.color);
  }
  console.log(`Seeded ${categories.length} categories`);

  const insertProvider = db.prepare(`
    INSERT OR REPLACE INTO Provider (id, name, logo, description, totalMaterials, formats, languages, priceModel, rating, url, categories, established, headquarters)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const prov of providers) {
    insertProvider.run(
      prov.id, prov.name, prov.logo, prov.description, prov.totalMaterials,
      JSON.stringify(prov.formats), JSON.stringify(prov.languages),
      prov.priceModel, prov.rating, prov.url,
      JSON.stringify(prov.categories), prov.established, prov.headquarters
    );
  }
  console.log(`Seeded ${providers.length} providers`);

  const insertMaterial = db.prepare(`
    INSERT OR REPLACE INTO Material (id, title, source, providerId, course, format, language, level, year, rating, reviewCount, price, accessUrl, description, fullContent, categoryId, instructor, university, citations, tags, thumbnail, pages, duration, isbn, doi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const mat of materials) {
    insertMaterial.run(
      mat.id, mat.title, mat.source, mat.provider, mat.course,
      mat.format, mat.language, mat.level, mat.year,
      mat.rating, mat.reviewCount, mat.price, mat.accessUrl,
      mat.description, mat.fullContent, mat.category,
      mat.instructor, mat.university, mat.citations,
      JSON.stringify(mat.tags),
      mat.thumbnail ?? null, mat.pages ?? null, mat.duration ?? null,
      mat.isbn ?? null, mat.doi ?? null
    );
  }
  console.log(`Seeded ${materials.length} materials`);

  console.log("Seeding complete!");
}

try {
  seed();
} catch (e) {
  console.error("Seed failed:", e);
  process.exit(1);
} finally {
  db.close();
}
