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

interface WikiSearchResponse {
    query: {
        search: {
            title: string;
            pageid: number;
            snippet: string;
            timestamp: string;
        }[];
    };
}

export class WikipediaService {
    private stripHtmlTags(text: string): string {
        if (!text) return '';
        // More robust stripping: remove scripts, tags, and collapse whitespace
        return text
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
            .replace(/<[^>]*>?/gm, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private getFallbackImage(category?: string): string {
        const fallbackImages: Record<string, string> = {
            science: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
            politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620',
            war: 'https://images.unsplash.com/photo-1505373633519-c0ae2f1b490f',
            culture: 'https://images.unsplash.com/photo-1467307983825-619715426c70',
            discovery: 'https://images.unsplash.com/photo-1500076656116-558758c991c1',
            space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
            natural_disaster: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2',
            medicine: 'https://images.unsplash.com/photo-1576091160550-217359f488d5',
            religion: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
            economics: 'https://images.unsplash.com/photo-1611974717482-58a00f9397f0',
            sports: 'https://images.unsplash.com/photo-1461896756913-7597af659228',
            art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
            literature: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
            default: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
        };

        const key = (category && fallbackImages[category]) ? category : 'default';
        return `${fallbackImages[key]}?q=80&w=1200&auto=format&fit=crop`;
    }

    /**
     * Search Wikipedia for events/pages based on query
     */
    async searchWikipedia(query: string, lang: string = 'en', limit: number = 12): Promise<Event[]> {
        try {
            console.log(`Searching Wikipedia: "${query}" [${lang}]`);

            // 1. Search for titles
            const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=${limit}&origin=*`;
            const searchRes = await fetch(searchUrl, {
                headers: { 'User-Agent': 'Eratracker/1.0 (Support@eratracker.com)' }
            });

            if (!searchRes.ok) throw new Error(`Search failed: ${searchRes.statusText}`);
            const searchData = (await searchRes.json()) as WikiSearchResponse;
            const titles = (searchData.query?.search || []).map(s => s.title);

            if (titles.length === 0) return [];

            // 2. Fetch summaries for these titles from REST API (more reliable/modern)
            // Note: We do them in parallel for speed
            const eventResults: Event[] = await Promise.all(
                titles.map(async (title): Promise<Event | null> => {
                    try {
                        const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
                        const summaryRes = await fetch(summaryUrl, {
                            headers: { 'User-Agent': 'Eratracker/1.0 (Support@eratracker.com)' }
                        });

                        if (!summaryRes.ok) return null;
                        const summary = (await summaryRes.json()) as any;

                        // Parse year from description or text if possible
                        let yearMatch = title.match(/\b(1\d{3}|20\d{2})\b/) || query.match(/\b(1\d{3}|20\d{2})\b/);
                        let year = yearMatch ? parseInt(yearMatch[0]) : 2024;

                        const category = 'culture';
                        const titleSlug = (summary.title || summary.displaytitle || title).replace(/ /g, '_');
                        return {
                            id: `wiki-${lang}-${titleSlug}`,
                            title: this.stripHtmlTags(summary.displaytitle || summary.title),
                            description: this.stripHtmlTags(summary.extract || summary.description || ''),
                            date: {
                                year,
                                era: year < 0 ? 'BCE' : 'CE'
                            },
                            category,
                            importance: 'high',
                            imageUrl: summary.thumbnail?.source || summary.originalimage?.source || this.getFallbackImage(category),
                            sources: [{
                                url: summary.content_urls?.desktop.page,
                                title: 'Wikipedia'
                            }],
                            relatedEventIds: [],
                            tags: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                    } catch (e) {
                        console.error(`Failed to fetch summary for ${title}:`, e);
                        return null;
                    }
                })
            ).then(results => results.filter((e): e is Event => e !== null));

            return eventResults;

        } catch (error) {
            console.error('Wikipedia search failed:', error);
            return [];
        }
    }

    /**
     * Fetch rich preview content for a Wikipedia article (20-30 lines)
     */
    async getArticlePreview(lang: string, title: string): Promise<any> {
        try {
            const titleSlug = encodeURIComponent(title.replace(/ /g, '_'));
            console.log(`Fetching rich preview for: ${title} [${lang}]`);

            // 1. Fetch Summary
            const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${titleSlug}`;
            const summaryRes = await fetch(summaryUrl, {
                headers: { 'User-Agent': 'Eratracker/1.0 (Support@eratracker.com)' }
            });

            if (!summaryRes.ok) throw new Error(`Summary fetch failed: ${summaryRes.status}`);
            const summary = await summaryRes.json() as any;

            // 2. Fetch Lead Section for more content
            const leadUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-sections-lead/${titleSlug}`;
            const leadRes = await fetch(leadUrl, {
                headers: { 'User-Agent': 'Eratracker/1.0 (Support@eratracker.com)' }
            });

            let richContent = summary.extract || '';

            if (leadRes.ok) {
                const leadData = await leadRes.json() as any;
                const leadText = leadData.sections?.[0]?.text;
                if (leadText) {
                    const cleanedLead = this.stripHtmlTags(leadText);
                    // Use the longer one or combine if needed
                    if (cleanedLead.length > richContent.length) {
                        richContent = cleanedLead;
                    }
                }
            }

            // Limit to ~25 lines (approx 2000-3000 chars)
            // Split by sentences or paragraphs to keep it readable
            const sentences = richContent.split(/\. /);
            const limitedContent = sentences.slice(0, 25).join('. ') + (sentences.length > 25 ? '.' : '');

            return {
                title: this.stripHtmlTags(summary.displaytitle || summary.title),
                imageUrl: summary.originalimage?.source || summary.thumbnail?.source || this.getFallbackImage(),
                previewContent: limitedContent,
                sourceUrl: summary.content_urls?.desktop.page,
                attribution: 'هذا المحتوى مقتطف من ويكيبيديا. جميع الحقوق محفوظة لمؤلفي ويكيبيديا.'
            };

        } catch (error) {
            console.error('Failed to get Wikipedia article preview:', error);
            throw error;
        }
    }

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
                        'User-Agent': 'Eratracker/1.0 (Support@eratracker.com)'
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

        const category = 'culture'; // Default fallback
        const titleSlug = (mainPage?.title || wikiEvent.text.split(' – ')[0] || 'article').replace(/ /g, '_');
        return {
            id: `wiki-${lang}-${titleSlug}`, // Readable ID for enrichment
            title: this.stripHtmlTags(mainPage?.displaytitle || wikiEvent.text),
            description: this.stripHtmlTags(wikiEvent.text),
            date: {
                year: wikiEvent.year,
                month,
                day,
                era: wikiEvent.year < 0 ? 'BCE' : 'CE'
            },
            category,
            importance: 'medium',
            imageUrl: mainPage?.thumbnail?.source || mainPage?.originalimage?.source || this.getFallbackImage(category),
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
