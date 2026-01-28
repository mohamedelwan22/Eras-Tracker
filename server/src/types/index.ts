// Backend Types - Must match frontend src/lib/types.ts exactly
// ============================================================
// 
// MULTILINGUAL FALLBACK BEHAVIOR:
// - If titleAr/titleFr is null/undefined, backend returns title as fallback
// - Same rule applies to descriptionAr/descriptionFr -> description
// - This ensures the frontend always has content to display
//
// ID STRATEGY:
// - All IDs are CUID strings (e.g., "clq...")
// - Frontend treats id as string everywhere
// - No numeric IDs are used
// ============================================================

export type Era = 'BCE' | 'CE';
export type Importance = 'low' | 'medium' | 'high' | 'critical';

export type EventCategory =
    | 'science'
    | 'politics'
    | 'war'
    | 'culture'
    | 'discovery'
    | 'invention'
    | 'natural_disaster'
    | 'medicine'
    | 'space'
    | 'religion'
    | 'economics'
    | 'sports'
    | 'art'
    | 'literature';

export interface Source {
    title: string;
    url?: string;
    author?: string;
    publishedDate?: string;
}

export interface Event {
    id: string;  // CUID string, never numeric
    title: string;
    titleAr?: string;
    titleFr?: string;
    description: string;
    descriptionAr?: string;
    descriptionFr?: string;
    date: {
        year: number;
        month?: number;
        day?: number;
        era: Era;
    };
    category: EventCategory;
    country?: string;
    countryCode?: string;  // ISO 3166-1 alpha-2 (e.g., "US", "EG")
    imageUrl?: string;
    importance: Importance;
    sources: Source[];
    relatedEventIds?: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Author {
    id: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    titleAr?: string;
    titleFr?: string;
    excerpt: string;
    excerptAr?: string;
    excerptFr?: string;
    content: string;
    contentAr?: string;
    contentFr?: string;
    coverImageUrl: string;
    author: Author;
    category: string;
    tags: string[];
    readingTime: number;
    publishedAt: string;
    updatedAt: string;
}

export interface SearchParams {
    year: number;
    month?: number;
    day?: number;
    category?: EventCategory;
    country?: string;
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'importance';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================
// UNIFIED API RESPONSE CONTRACT
// All endpoints MUST return this shape
// ============================================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    meta?: {
        cached?: boolean;
        timestamp?: string;
        [key: string]: unknown;
    };
}

// Specific response types using the unified contract
export interface SearchResponseData {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
}

export interface OnThisDayData {
    date: { month: number; day: number };
    events: Event[];
    total: number;
}

export interface ArticlesData {
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
}

// Response type aliases for backwards compatibility
export type SearchResponse = ApiResponse<SearchResponseData>;
export type EventResponse = ApiResponse<Event | null>;
export type ArticlesResponse = ApiResponse<ArticlesData>;
export type ArticleResponse = ApiResponse<Article | null>;
export type OnThisDayResponse = ApiResponse<OnThisDayData>;
