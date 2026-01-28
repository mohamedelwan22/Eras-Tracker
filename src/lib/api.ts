import axios from 'axios';
import {
  SearchParams,
  SearchResponse,
  EventResponse,
  ArticlesResponse,
  ArticleResponse,
  OnThisDayResponse
} from './types';

// Axios instance configured for backend integration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Search events
export async function searchEvents(params: SearchParams): Promise<SearchResponse> {
  const response = await api.post<SearchResponse>('/search', params);
  return response.data;
}

// Get event by ID
export async function getEventById(id: string): Promise<EventResponse> {
  const response = await api.get<EventResponse>(`/event/${id}`);
  return response.data;
}

// Get events for "On This Day"
export async function getOnThisDay(month: number, day: number): Promise<OnThisDayResponse> {
  const response = await api.get<OnThisDayResponse>('/on-this-day', {
    params: { month, day }
  });
  return response.data;
}

// Get random events
export async function getRandomEvents(count: number = 5): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>('/random', {
    params: { count }
  });
  return response.data;
}

// Get articles
export async function getArticles(page: number = 1, limit: number = 10): Promise<ArticlesResponse> {
  const response = await api.get<ArticlesResponse>('/articles', {
    params: { page, limit }
  });
  return response.data;
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
  const response = await api.get<ArticleResponse>(`/articles/${slug}`);
  return response.data;
}

// Get featured events (for homepage)
export async function getFeaturedEvents(): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>('/featured');
  return response.data;
}

export default api;
