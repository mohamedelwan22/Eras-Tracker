import axios from 'axios';
import {
    SearchParams,
    SearchResponse,
    EventResponse,
    ArticlesResponse,
    ArticleResponse,
    OnThisDayResponse,
    WikiPreviewResponse
} from '@/lib/types';

// Centralized API configuration instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// API Methods
export async function searchEvents(params: SearchParams, config?: { signal?: AbortSignal }): Promise<SearchResponse> {
    const response = await api.post<SearchResponse>('/search', params, config);
    return response.data;
}

export async function getEventById(id: string): Promise<EventResponse> {
    const response = await api.get<EventResponse>(`/event/${id}`);
    return response.data;
}

export async function getOnThisDay(month: number, day: number): Promise<OnThisDayResponse> {
    const response = await api.get<OnThisDayResponse>('/on-this-day', {
        params: { month, day }
    });
    return response.data;
}

export async function getRandomEvents(count: number = 5): Promise<SearchResponse> {
    const response = await api.get<SearchResponse>('/random', {
        params: { count }
    });
    return response.data;
}

export async function getArticles(page: number = 1, limit: number = 10): Promise<ArticlesResponse> {
    const response = await api.get<ArticlesResponse>('/articles', {
        params: { page, limit }
    });
    return response.data;
}

export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
    const response = await api.get<ArticleResponse>(`/articles/${slug}`);
    return response.data;
}

export async function getFeaturedEvents(): Promise<SearchResponse> {
    const response = await api.get<SearchResponse>('/featured');
    return response.data;
}

export async function getWikipediaPreview(id: string): Promise<WikiPreviewResponse> {
    const response = await api.get<WikiPreviewResponse>(`/event/wiki/preview/${id}`);
    return response.data;
}

export default api;
