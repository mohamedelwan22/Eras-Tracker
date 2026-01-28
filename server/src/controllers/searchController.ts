import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { searchParamsSchema, onThisDayParamsSchema, randomParamsSchema } from '../schemas/index.js';
import type { Event, SearchResponse, OnThisDayResponse, Era, Importance } from '../types/index.js';

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
function transformEvent(dbEvent: any): Event {
    return {
        id: dbEvent.id, // CUID string
        title: dbEvent.title,
        // Multilingual fallback: if null, use default title
        titleAr: dbEvent.titleAr || dbEvent.title,
        titleFr: dbEvent.titleFr || dbEvent.title,
        description: dbEvent.description,
        // Multilingual fallback: if null, use default description
        descriptionAr: dbEvent.descriptionAr || dbEvent.description,
        descriptionFr: dbEvent.descriptionFr || dbEvent.description,
        date: {
            year: dbEvent.year,
            month: dbEvent.month || undefined,
            day: dbEvent.day || undefined,
            era: dbEvent.era as Era,
        },
        category: dbEvent.category,
        country: dbEvent.country || undefined,
        countryCode: dbEvent.countryCode || undefined,
        imageUrl: dbEvent.imageUrl || undefined,
        importance: dbEvent.importance as Importance,
        sources: JSON.parse(dbEvent.sources || '[]'),
        relatedEventIds: JSON.parse(dbEvent.relatedEventIds || '[]'),
        tags: JSON.parse(dbEvent.tags || '[]'),
        createdAt: dbEvent.createdAt.toISOString(),
        updatedAt: dbEvent.updatedAt.toISOString(),
    };
}

// POST /api/search
export async function searchEvents(req: Request, res: Response, next: NextFunction) {
    try {
        const params = searchParamsSchema.parse(req.body);

        // Build where clause
        const where: any = {
            year: params.year,
        };

        if (params.month) where.month = params.month;
        if (params.day) where.day = params.day;
        if (params.category) where.category = params.category;
        if (params.country) where.countryCode = params.country;

        // Get total count
        const total = await prisma.event.count({ where });

        // Get paginated results
        const events = await prisma.event.findMany({
            where,
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            orderBy: params.sortBy === 'importance'
                ? { importance: params.sortOrder }
                : { year: params.sortOrder },
        });

        // Unified response contract
        const response: SearchResponse = {
            success: true,
            data: {
                events: events.map(transformEvent),
                total,
                page: params.page,
                totalPages: Math.ceil(total / params.limit) || 1,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
}

// GET /api/random
export async function getRandomEvents(req: Request, res: Response, next: NextFunction) {
    try {
        const params = randomParamsSchema.parse(req.query);

        // Build where clause for category filter
        const whereClause = params.category ? `WHERE category = '${params.category}'` : '';

        // Get random events using raw SQL
    //     const events = await prisma.$queryRawUnsafe<any[]>(`
    //   SELECT * FROM events 
    //   ${whereClause}
    //   ORDER BY RANDOM() 
    //   LIMIT ${params.count}
    // `);
        const events = (await prisma.$queryRawUnsafe(`
            SELECT * FROM events
            ${whereClause}
            ORDER BY RANDOM()
            LIMIT ${params.count}
            `)) as unknown as Event[];


        // Unified response contract
        const response: SearchResponse = {
            success: true,
            data: {
                events: events.map(transformEvent),
                total: events.length,
                page: 1,
                totalPages: 1,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
}

// GET /api/featured
export async function getFeaturedEvents(_req: Request, res: Response, next: NextFunction) {
    try {
        const events = await prisma.event.findMany({
            where: { importance: 'critical' },
            take: 6,
            orderBy: { updatedAt: 'desc' },
        });

        // Unified response contract
        const response: SearchResponse = {
            success: true,
            data: {
                events: events.map(transformEvent),
                total: events.length,
                page: 1,
                totalPages: 1,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
}

// GET /api/on-this-day
export async function getOnThisDay(req: Request, res: Response, next: NextFunction) {
    try {
        const params = onThisDayParamsSchema.parse(req.query);

        const events = await prisma.event.findMany({
            where: {
                month: params.month,
                day: params.day,
            },
            orderBy: { year: 'desc' },
        });

        // Unified response contract
        const response: OnThisDayResponse = {
            success: true,
            data: {
                date: { month: params.month, day: params.day },
                events: events.map(transformEvent),
                total: events.length,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
}
