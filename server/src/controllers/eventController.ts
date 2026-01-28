import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Event, EventResponse, Era, Importance } from '../types/index.js';

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

// GET /api/event/:id
export async function getEventById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };

        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            // Unified error response
            const response: EventResponse = {
                success: false,
                data: null,
                error: 'Event not found',
            };
            res.status(404).json(response);
            return;
        }

        // Unified success response
        const response: EventResponse = {
            success: true,
            data: transformEvent(event),
            meta: {
                timestamp: new Date().toISOString(),
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
}
