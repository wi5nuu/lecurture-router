import { MeiliSearch } from 'meilisearch';
import { logger } from './logger';
import prisma from './db';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

const MATERIALS_INDEX = 'materials';
const PROVIDERS_INDEX = 'providers';

// Initialize search indexes
export async function initializeSearchIndexes() {
  try {
    // Create materials index
    await client.createIndex(MATERIALS_INDEX, { primaryKey: 'id' });
    
    // Configure searchable attributes
    await client.index(MATERIALS_INDEX).updateSearchableAttributes([
      'title',
      'description',
      'tags',
      'instructor',
      'university',
      'course',
    ]);

    // Configure filterable attributes
    await client.index(MATERIALS_INDEX).updateFilterableAttributes([
      'providerId',
      'categoryId',
      'format',
      'language',
      'level',
      'year',
      'rating',
      'isPublished',
    ]);

    // Configure sortable attributes
    await client.index(MATERIALS_INDEX).updateSortableAttributes([
      'title',
      'rating',
      'year',
      'createdAt',
      'viewCount',
    ]);

    // Create providers index
    await client.createIndex(PROVIDERS_INDEX, { primaryKey: 'id' });
    
    await client.index(PROVIDERS_INDEX).updateSearchableAttributes([
      'name',
      'description',
    ]);

    await client.index(PROVIDERS_INDEX).updateFilterableAttributes([
      'isActive',
      'rating',
    ]);

    logger.info('Search indexes initialized successfully');
  } catch (error: any) {
    if (error.code !== 'index_already_exists') {
      logger.error('Failed to initialize search indexes', error);
      throw error;
    }
  }
}

// Index a single material
export async function indexMaterial(materialId: string) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: {
        provider: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    if (!material) {
      logger.warn('Material not found for indexing', { materialId });
      return;
    }

    const document = {
      id: material.id,
      title: material.title,
      description: material.description,
      tags: material.tags,
      instructor: material.instructor,
      university: material.university,
      course: material.course,
      providerId: material.providerId,
      providerName: material.provider.name,
      categoryId: material.categoryId,
      categoryName: material.category.name,
      format: material.format,
      language: material.language,
      level: material.level,
      year: material.year,
      rating: material.rating,
      viewCount: material.viewCount,
      isPublished: material.isPublished,
      createdAt: material.createdAt.getTime(),
    };

    await client.index(MATERIALS_INDEX).addDocuments([document]);
    logger.debug('Material indexed', { materialId });
  } catch (error) {
    logger.error('Failed to index material', error, { materialId });
    throw error;
  }
}

// Index multiple materials
export async function indexMaterials(materialIds: string[]) {
  try {
    const materials = await prisma.material.findMany({
      where: { id: { in: materialIds } },
      include: {
        provider: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    const documents = materials.map((material) => ({
      id: material.id,
      title: material.title,
      description: material.description,
      tags: material.tags,
      instructor: material.instructor,
      university: material.university,
      course: material.course,
      providerId: material.providerId,
      providerName: material.provider.name,
      categoryId: material.categoryId,
      categoryName: material.category.name,
      format: material.format,
      language: material.language,
      level: material.level,
      year: material.year,
      rating: material.rating,
      viewCount: material.viewCount,
      isPublished: material.isPublished,
      createdAt: material.createdAt.getTime(),
    }));

    await client.index(MATERIALS_INDEX).addDocuments(documents);
    logger.info('Materials indexed', { count: documents.length });
  } catch (error) {
    logger.error('Failed to index materials', error);
    throw error;
  }
}

// Index all materials (for initial sync)
export async function indexAllMaterials() {
  try {
    const batchSize = 1000;
    let skip = 0;
    let total = 0;

    while (true) {
      const materials = await prisma.material.findMany({
        where: { isPublished: true },
        skip,
        take: batchSize,
        include: {
          provider: { select: { name: true } },
          category: { select: { name: true } },
        },
      });

      if (materials.length === 0) break;

      const documents = materials.map((material) => ({
        id: material.id,
        title: material.title,
        description: material.description,
        tags: material.tags,
        instructor: material.instructor,
        university: material.university,
        course: material.course,
        providerId: material.providerId,
        providerName: material.provider.name,
        categoryId: material.categoryId,
        categoryName: material.category.name,
        format: material.format,
        language: material.language,
        level: material.level,
        year: material.year,
        rating: material.rating,
        viewCount: material.viewCount,
        isPublished: material.isPublished,
        createdAt: material.createdAt.getTime(),
      }));

      await client.index(MATERIALS_INDEX).addDocuments(documents);
      
      total += materials.length;
      skip += batchSize;

      logger.info('Indexed batch of materials', { count: materials.length, total });
    }

    logger.info('All materials indexed', { total });
    return total;
  } catch (error) {
    logger.error('Failed to index all materials', error);
    throw error;
  }
}

// Delete material from index
export async function deleteMaterialFromIndex(materialId: string) {
  try {
    await client.index(MATERIALS_INDEX).deleteDocument(materialId);
    logger.debug('Material deleted from index', { materialId });
  } catch (error) {
    logger.error('Failed to delete material from index', error, { materialId });
  }
}

// Search materials
export async function searchMaterials(
  query: string,
  filters?: {
    categoryId?: string;
    providerId?: string;
    format?: string;
    language?: string;
    level?: string;
    minRating?: number;
  },
  options?: {
    limit?: number;
    offset?: number;
    sort?: string[];
  }
) {
  try {
    const filterArray: string[] = ['isPublished = true'];

    if (filters?.categoryId) {
      filterArray.push(`categoryId = "${filters.categoryId}"`);
    }
    if (filters?.providerId) {
      filterArray.push(`providerId = "${filters.providerId}"`);
    }
    if (filters?.format) {
      filterArray.push(`format = "${filters.format}"`);
    }
    if (filters?.language) {
      filterArray.push(`language = "${filters.language}"`);
    }
    if (filters?.level) {
      filterArray.push(`level = "${filters.level}"`);
    }
    if (filters?.minRating) {
      filterArray.push(`rating >= ${filters.minRating}`);
    }

    const searchParams: any = {
      filter: filterArray,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
    };

    if (options?.sort && options.sort.length > 0) {
      searchParams.sort = options.sort;
    }

    const results = await client.index(MATERIALS_INDEX).search(query, searchParams);

    logger.debug('Search completed', {
      query,
      hits: results.hits.length,
      estimatedTotalHits: results.estimatedTotalHits,
    });

    return results;
  } catch (error) {
    logger.error('Search failed', error, { query, filters });
    throw error;
  }
}

// Get search suggestions (autocomplete)
export async function getSearchSuggestions(query: string, limit: number = 5) {
  try {
    const results = await client.index(MATERIALS_INDEX).search(query, {
      limit,
      attributesToRetrieve: ['id', 'title'],
    });

    return results.hits.map((hit: any) => ({
      id: hit.id,
      title: hit.title,
    }));
  } catch (error) {
    logger.error('Failed to get search suggestions', error, { query });
    return [];
  }
}

// Index a provider
export async function indexProvider(providerId: string) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) return;

    const document = {
      id: provider.id,
      name: provider.name,
      description: provider.description,
      rating: provider.rating,
      isActive: provider.isActive,
    };

    await client.index(PROVIDERS_INDEX).addDocuments([document]);
    logger.debug('Provider indexed', { providerId });
  } catch (error) {
    logger.error('Failed to index provider', error, { providerId });
  }
}

// Search providers
export async function searchProviders(query: string, limit: number = 20) {
  try {
    const results = await client.index(PROVIDERS_INDEX).search(query, {
      filter: ['isActive = true'],
      limit,
    });

    return results;
  } catch (error) {
    logger.error('Provider search failed', error, { query });
    throw error;
  }
}

// Get search statistics
export async function getSearchStats() {
  try {
    const materialsIndex = client.index(MATERIALS_INDEX);
    const stats = await materialsIndex.getStats();
    
    return {
      numberOfDocuments: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
      fieldDistribution: stats.fieldDistribution,
    };
  } catch (error) {
    logger.error('Failed to get search stats', error);
    return null;
  }
}

export { client as searchClient };
export default client;
