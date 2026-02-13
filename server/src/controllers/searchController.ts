import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Event as PrismaEvent } from '@prisma/client';

import {
  searchParamsSchema,
  onThisDayParamsSchema,
  randomParamsSchema,
} from '../schemas/index.js';

import type {
  Event,
  SearchResponse,
  OnThisDayResponse,
  Era,
  Importance,
  EventCategory,
} from '../types/index.js';

import { wikipediaService } from '../services/wikipediaService.js';

const prisma = new PrismaClient();

/**
 * Transform Prisma Event to API Event format
 *
 * MULTILINGUAL FALLBACK BEHAVIOR:
 * - titleAr falls back to title if null
 * - titleFr falls back to title if null
 * - descriptionAr falls back to description if null
 * - descriptionFr falls back to description if null
 */
function transformEvent(dbEvent: PrismaEvent): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    titleAr: dbEvent.titleAr || dbEvent.title,
    titleFr: dbEvent.titleFr || dbEvent.title,
    description: dbEvent.description,
    descriptionAr: dbEvent.descriptionAr || dbEvent.description,
    descriptionFr: dbEvent.descriptionFr || dbEvent.description,
    date: {
      year: dbEvent.year,
      month: dbEvent.month ?? undefined,
      day: dbEvent.day ?? undefined,
      era: dbEvent.era as Era,
    },
    category: dbEvent.category as EventCategory,
    country: dbEvent.country ?? undefined,
    countryCode: dbEvent.countryCode ?? undefined,
    imageUrl: dbEvent.imageUrl ?? undefined,
    importance: dbEvent.importance as Importance,
    sources: JSON.parse(dbEvent.sources || '[]'),
    relatedEventIds: JSON.parse(dbEvent.relatedEventIds || '[]'),
    tags: JSON.parse(dbEvent.tags || '[]'),
    createdAt:
      dbEvent.createdAt instanceof Date
        ? dbEvent.createdAt.toISOString()
        : new Date(dbEvent.createdAt ?? Date.now()).toISOString(),

    updatedAt:
      dbEvent.updatedAt instanceof Date
        ? dbEvent.updatedAt.toISOString()
        : new Date(dbEvent.updatedAt ?? Date.now()).toISOString(),

  };
}

// POST /api/search
export async function searchEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = searchParamsSchema.parse(req.body);

    const where: any = {};

    // Only apply year filter if it's within a valid range (0 - 2026 for now)
    // Actually, let's just use what's provided.
    if (params.year) where.year = params.year;

    if (params.month) where.month = params.month;
    if (params.day) where.day = params.day;
    if (params.category) where.category = params.category;
    if (params.country) where.countryCode = params.country;

    if (params.query) {
      where.OR = [
        { title: { contains: params.query } },
        { titleAr: { contains: params.query } },
        { titleFr: { contains: params.query } },
        { description: { contains: params.query } },
        { descriptionAr: { contains: params.query } },
        { descriptionFr: { contains: params.query } },
      ];
    }

    const total = await prisma.event.count({ where });

    const dbEvents = await prisma.event.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy:
        params.sortBy === 'importance'
          ? { importance: params.sortOrder }
          : { year: params.sortOrder },
    });

    let allEvents = dbEvents.map(transformEvent);

    // 2. Wikipedia Live Search Integration
    // If we have a query or year, and we are on the first page, fetch from Wikipedia too
    if ((params.query || params.year) && params.page === 1) {
      const searchQuery = params.query
        ? (params.year ? `${params.year} ${params.query}` : params.query)
        : String(params.year);

      // Basic Arabic detection
      const isArabic = /[\u0600-\u06FF]/.test(searchQuery);
      const wikiLang = isArabic ? 'ar' : 'en';

      const wikiEvents = await wikipediaService.searchWikipedia(searchQuery, wikiLang, 10);

      // Combine results, prioritizing DB events but adding Wiki ones
      // In a real app, we might want to deduplicate by title
      allEvents = [...allEvents, ...wikiEvents];

      // Re-sort combined results if needed, though they are already merged
      if (params.sortBy === 'importance') {
        allEvents.sort((a, b) => {
          const impMap = { critical: 4, high: 3, medium: 2, low: 1 };
          const valA = impMap[a.importance] || 0;
          const valB = impMap[b.importance] || 0;
          return params.sortOrder === 'desc' ? valB - valA : valA - valB;
        });
      } else {
        allEvents.sort((a, b) => {
          const valA = a.date.year;
          const valB = b.date.year;
          return params.sortOrder === 'desc' ? valB - valA : valA - valB;
        });
      }

      // Limit to requested limit
      allEvents = allEvents.slice(0, params.limit);
    }

    const response: SearchResponse = {
      success: true,
      data: {
        events: allEvents,
        total: Math.max(total, allEvents.length), // Approximate total
        page: params.page,
        totalPages: Math.ceil(Math.max(total, allEvents.length) / params.limit) || 1,
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: allEvents.some(e => e.id.startsWith('wiki')) ? 'database+wikipedia' : 'database'
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

// GET /api/random
export async function getRandomEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = randomParamsSchema.parse(req.query);
    const limit = Math.min(params.limit, 12); // Hard cap at 12

    const where: any = {};
    if (params.category) where.category = params.category;

    // 1. Get total count for the specified where clause
    const totalCount = await prisma.event.count({ where });

    if (totalCount === 0) {
      return res.json({
        success: true,
        data: {
          events: [],
          total: 0,
          page: 1,
          totalPages: 1,
        },
        meta: { timestamp: new Date().toISOString() },
      });
    }

    // 2. Calculate random offset
    // We want to pick a starting point such that we can ideally take 'limit' items
    let randomOffset = Math.floor(Math.random() * totalCount);

    // 3. Fetch events
    let events: PrismaEvent[] = [];

    if (randomOffset + limit <= totalCount) {
      // Basic case: we have enough items after the offset
      events = await prisma.event.findMany({
        where,
        skip: randomOffset,
        take: limit,
      });
    } else {
      // Wrap-around case: we need to combine from end and beginning
      const endCount = totalCount - randomOffset;
      const startCount = limit - endCount;

      const [endEvents, startEvents] = await Promise.all([
        prisma.event.findMany({
          where,
          skip: randomOffset,
          take: endCount,
        }),
        prisma.event.findMany({
          where,
          skip: 0,
          take: Math.min(startCount, totalCount), // Ensure we don't over-fetch if limit > totalCount
        }),
      ]);

      events = [...endEvents, ...startEvents];
    }

    const response: SearchResponse = {
      success: true,
      data: {
        events: events
          .sort(() => Math.random() - 0.5) // Shuffle for better perceived randomness
          .map(transformEvent),
        total: totalCount,
        page: 1,
        totalPages: 1,
      },
      meta: { timestamp: new Date().toISOString() },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

// GET /api/featured
export async function getFeaturedEvents(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const events = await prisma.event.findMany({
      where: { importance: 'critical' },
      take: 6,
      orderBy: { updatedAt: 'desc' },
    });

    const response: SearchResponse = {
      success: true,
      data: {
        events: events.map(transformEvent),
        total: events.length,
        page: 1,
        totalPages: 1,
      },
      meta: { timestamp: new Date().toISOString() },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

// GET /api/on-this-day
export async function getOnThisDay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = onThisDayParamsSchema.parse(req.query);

    // ✅ IMPORTANT FIX: explicit Prisma typing
    const dbEvents: PrismaEvent[] = await prisma.event.findMany({
      where: {
        month: params.month,
        day: params.day,
      },
      orderBy: { year: 'desc' },
    });

    const wikiEvents = await wikipediaService.getOnThisDayEvents(
      params.month,
      params.day
    );

    const dbYears = new Set<number>(dbEvents.map(e => e.year));

    const newWikiEvents = wikiEvents.filter(
      we => !dbYears.has(we.date.year)
    );

    const allEvents: Event[] = [
      ...dbEvents.map(transformEvent),
      ...newWikiEvents,
    ];

    allEvents.sort((a, b) => b.date.year - a.date.year);

    const response: OnThisDayResponse = {
      success: true,
      data: {
        date: { month: params.month, day: params.day },
        events: allEvents,
        total: allEvents.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: 'database+wikipedia',
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
