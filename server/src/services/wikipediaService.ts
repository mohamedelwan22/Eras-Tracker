import { PrismaClient } from '@prisma/client';
import { Event, Era, Importance } from '../types/index.js';

const prisma = new PrismaClient();

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1'; // Default, will change per lang

interface WikiOnThisDayResponse {
    selected: WikiEvent[];
    births: WikiEvent[];
    deaths: WikiEvent[];
    events: WikiEvent[];
}

interface WikiEvent {
    text: string;
    pages: WikiPage[];
    year: number;
}

interface WikiPage {
    type: string;
    title: string;
    displaytitle: string;
    originalimage?: {
        source: string;
        width: number;
        height: number;
    };
    description?: string;
    content_urls: {
        desktop: {
            page: string;
        };
        mobile: {
            page: string;
        };
    };
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
}

export class WikipediaService {
    /**
     * Fetch events for "On This Day" from Wikipedia
     * Checks Cache -> Wiki API -> DB Cache
     */
    async getOnThisDayEvents(month: number, day: number, lang: string = 'en'): Promise<Event[]> {
        const cacheKey = `on-this-day-${month}-${day}-${lang}`;

        // 1. Check Cache
        const cached = await prisma.cachedSearch.findUnique({
            where: { queryHash: cacheKey }
        });

        if (cached && new Date() < cached.expiresAt) {
            console.log('Returning cached Wikipedia results');
            return JSON.parse(cached.results);
        }

        // 2. Fetch from Wikipedia
        try {
            console.log(`Fetching from Wikipedia API: ${month}/${day} [${lang}]`);
            const response = await fetch(
                `https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`,
                {
                    headers: {
                        'User-Agent': 'ErasTracker/1.0 (contact@erastracker.com)'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 404) return [];
                throw new Error(`Wikipedia API error: ${response.statusText}`);
            }

            const data = (await response.json()) as WikiOnThisDayResponse;

            // Transform to our Event model
            const events: Event[] = (data.selected || []).map(wikiEvent => this.transformWikiEvent(wikiEvent, month, day, lang));

            // 3. Save to Cache
            // Remove old cache if exists (upsert logic handled by create/update usually, but unique constraint helps)
            // We use upsert to be safe
            await prisma.cachedSearch.upsert({
                where: { queryHash: cacheKey },
                update: {
                    results: JSON.stringify(events),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h TTL
                    queryParams: JSON.stringify({ month, day, lang })
                },
                create: {
                    queryHash: cacheKey,
                    results: JSON.stringify(events),
                    queryParams: JSON.stringify({ month, day, lang }),
                    language: lang,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
            });

            return events;

        } catch (error) {
            console.error('Wikipedia fetch failed:', error);
            // Return empty array on failure so we fall back to DB only
            return [];
        }
    }

    private transformWikiEvent(wikiEvent: WikiEvent, month: number, day: number, lang: string): Event {
        // Use the first related page for image/description
        const mainPage = wikiEvent.pages && wikiEvent.pages[0];

        return {
            id: `wiki-${lang}-${wikiEvent.year}-${month}-${day}-${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
            title: mainPage?.displaytitle || wikiEvent.text,
            description: wikiEvent.text,
            date: {
                year: wikiEvent.year,
                month,
                day,
                era: wikiEvent.year < 0 ? 'BCE' : 'CE'
            },
            category: 'culture', // Default fallback from allowed EventCategory union
            importance: 'medium',
            imageUrl: mainPage?.thumbnail?.source || mainPage?.originalimage?.source,
            sources: mainPage ? [{
                url: mainPage.content_urls.desktop.page,
                title: 'Wikipedia'
            }] : [],
            relatedEventIds: [],
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}

export const wikipediaService = new WikipediaService();
