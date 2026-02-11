// Eratracker Types - Backend-ready interfaces

export interface Event {
  id: string;
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
    era: 'BCE' | 'CE';
  };
  category: EventCategory;
  country?: string;
  countryCode?: string;
  imageUrl?: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  sources: Source[];
  relatedEventIds?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

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

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface SearchParams {
  year?: number;
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

export interface SearchResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
  };
  cached?: boolean;
  error?: string;
}

export interface EventResponse {
  success: boolean;
  data: Event;
  error?: string;
}

export interface ArticlesResponse {
  success: boolean;
  data: {
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
  };
  error?: string;
}

export interface ArticleResponse {
  success: boolean;
  data: Article;
  error?: string;
}

export interface OnThisDayResponse {
  success: boolean;
  data: {
    date: { month: number; day: number };
    events: Event[];
    total: number;
  };
  error?: string;
}

export interface Country {
  code: string;
  name: string;
  nameAr: string;
  nameFr: string;
}

export type Locale = 'ar' | 'en' | 'fr';
export type Direction = 'rtl' | 'ltr';
export type Theme = 'light' | 'dark';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  direction: Direction;
}
export interface WikiPreviewData {
  title: string;
  imageUrl?: string;
  previewContent: string;
  sourceUrl: string;
  attribution: string;
}

export interface WikiPreviewResponse {
  success: boolean;
  data: WikiPreviewData;
  error?: string;
}
