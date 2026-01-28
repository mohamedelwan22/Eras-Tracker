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

    const where: any = { year: params.year };
    if (params.month) where.month = params.month;
    if (params.day) where.day = params.day;
    if (params.category) where.category = params.category;
    if (params.country) where.countryCode = params.country;

    const total = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy:
        params.sortBy === 'importance'
          ? { importance: params.sortOrder }
          : { year: params.sortOrder },
    });

    const response: SearchResponse = {
      success: true,
      data: {
        events: events.map(transformEvent),
        total,
        page: params.page,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
      meta: { timestamp: new Date().toISOString() },
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

    const whereClause = params.category
      ? `WHERE category = '${params.category}'`
      : '';

    const events = (await prisma.$queryRawUnsafe(`
      SELECT * FROM events
      ${whereClause}
      ORDER BY RANDOM()
      LIMIT ${params.count}
    `)) as unknown as PrismaEvent[];

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
