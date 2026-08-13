-- Materials, providers, and categories have been moved to Firebase Firestore.
-- Bookmarks keep only the Firestore material id as a plain string.

-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_materialId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_categoryId_fkey";

-- DropTable
DROP TABLE "Material";

-- DropTable
DROP TABLE "Provider";

-- DropTable
DROP TABLE "Category";