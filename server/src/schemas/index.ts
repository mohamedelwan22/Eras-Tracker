import { z } from 'zod';

// ============================================
// VALIDATION ENUMS - Must match frontend types
// ============================================

export const eraEnum = z.enum(['CE', 'BCE']);

export const importanceEnum = z.enum(['low', 'medium', 'high', 'critical']);

export const categoryEnum = z.enum([
    'science', 'politics', 'war', 'culture', 'discovery',
    'invention', 'natural_disaster', 'medicine', 'space',
    'religion', 'economics', 'sports', 'art', 'literature'
]);

// ISO 3166-1 alpha-2 country code pattern (2 uppercase letters)
export const countryCodePattern = z.string().regex(/^[A-Z]{2}$/).optional();

// ============================================
// SEARCH PARAMS VALIDATION
// ============================================

export const searchParamsSchema = z.object({
    year: z.number().int().min(-5000).max(2026),
    month: z.number().int().min(1).max(12).optional(),
    day: z.number().int().min(1).max(31).optional(),
    category: categoryEnum.optional(),
    country: z.string().optional(),
    query: z.string().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(10),
    sortBy: z.enum(['date', 'importance']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// ON THIS DAY PARAMS VALIDATION
// ============================================

export const onThisDayParamsSchema = z.object({
    month: z.coerce.number().int().min(1).max(12),
    day: z.coerce.number().int().min(1).max(31),
});

// ============================================
// RANDOM EVENTS PARAMS VALIDATION
// ============================================

export const randomParamsSchema = z.object({
    count: z.coerce.number().int().min(1).max(20).default(5),
    category: categoryEnum.optional(),
});

// ============================================
// ARTICLES LIST PARAMS VALIDATION
// ============================================

export const articlesParamsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

// ============================================
// EVENT CREATION/UPDATE VALIDATION (for future use)
// ============================================

export const eventInputSchema = z.object({
    title: z.string().min(1).max(500),
    titleAr: z.string().optional(),
    titleFr: z.string().optional(),
    description: z.string().min(1),
    descriptionAr: z.string().optional(),
    descriptionFr: z.string().optional(),
    year: z.number().int().min(-5000).max(2026),
    month: z.number().int().min(1).max(12).optional(),
    day: z.number().int().min(1).max(31).optional(),
    era: eraEnum.default('CE'),
    category: categoryEnum,
    country: z.string().optional(),
    countryCode: countryCodePattern,
    importance: importanceEnum.default('medium'),
    imageUrl: z.string().url().optional(),
    sources: z.array(z.object({
        title: z.string(),
        url: z.string().url().optional(),
        author: z.string().optional(),
        publishedDate: z.string().optional(),
    })).default([]),
    relatedEventIds: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
export type OnThisDayParamsInput = z.infer<typeof onThisDayParamsSchema>;
export type RandomParamsInput = z.infer<typeof randomParamsSchema>;
export type ArticlesParamsInput = z.infer<typeof articlesParamsSchema>;
export type EventInput = z.infer<typeof eventInputSchema>;
export type Era = z.infer<typeof eraEnum>;
export type Importance = z.infer<typeof importanceEnum>;
export type Category = z.infer<typeof categoryEnum>;
