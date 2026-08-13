import { z } from "zod";

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  status: z.string().optional().default("Mahasiswa S1"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Material validation schemas
export const createMaterialSchema = z.object({
  title: z.string().min(1).max(200),
  source: z.string().min(1),
  providerId: z.string().uuid(),
  course: z.string().min(1),
  format: z.string().min(1),
  language: z.string().min(1),
  level: z.string().min(1),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  price: z.string().min(1),
  accessUrl: z.string().url(),
  description: z.string().min(1),
  fullContent: z.string().min(1),
  categoryId: z.string().uuid(),
  instructor: z.string().min(1),
  university: z.string().min(1),
  citations: z.number().int().min(0).default(0),
  tags: z.string(),
  thumbnail: z.string().url().optional(),
  pages: z.number().int().positive().optional(),
  duration: z.string().optional(),
  isbn: z.string().optional(),
  doi: z.string().optional(),
});

export const updateMaterialSchema = createMaterialSchema.partial();

// Bookmark validation
export const createBookmarkSchema = z.object({
  materialId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});

// Provider validation
export const createProviderSchema = z.object({
  name: z.string().min(1).max(100),
  logo: z.string().url(),
  description: z.string().min(1),
  formats: z.string(),
  languages: z.string(),
  priceModel: z.string().min(1),
  rating: z.number().min(0).max(5).default(0),
  url: z.string().url(),
  categories: z.string(),
  established: z.number().int().min(1800).max(new Date().getFullYear()),
  headquarters: z.string().min(1),
});

export const updateProviderSchema = createProviderSchema.partial();

// Category validation
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().min(1),
  description: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
});

export const updateCategorySchema = createCategorySchema.partial();

// Search & Pagination
export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  provider: z.string().optional(),
  format: z.string().optional(),
  language: z.string().optional(),
  level: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["title", "rating", "year", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// API Key validation
export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  expiresAt: z.string().datetime().optional(),
});

// Notification validation
export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  type: z.enum(["info", "success", "warning", "error"]),
  link: z.string().url().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Subscription validation
export const updateSubscriptionSchema = z.object({
  plan: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]),
});

// Helper function to validate request body
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

// Helper to extract validation errors
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });

  return formatted;
}
