import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Event, EventResponse, Era, Importance } from '../types/index.js';
import { wikipediaService } from '../services/wikipediaService.js';

const prisma = new PrismaClient();

/**
 * Transform Prisma Event to API Event format
 */
function transformEvent(dbEvent: any): Event {
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

        // 1. Handle Wikipedia IDs - Explicitly reject with 404 to avoid internal detail page mismatches
        if (id.startsWith('wiki-')) {
            const response: EventResponse = {
                success: false,
                data: null,
                error: 'External event - no internal detail page available.',
            };
            res.status(404).json(response);
            return;
        }

        // 2. Handle Database IDs
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

// GET /api/event/wiki/preview/:id
export async function getWikipediaPreview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };

        if (!id.startsWith('wiki-')) {
            res.status(400).json({
                success: false,
                error: 'Invalid Wikipedia ID - Must start with wiki-'
            });
            return;
        }

        // Example ID: wiki-en-Napoleon_Bonaparte
        const parts = id.split('-');
        if (parts.length < 3) {
            res.status(400).json({
                success: false,
                error: 'Malformed Wikipedia ID'
            });
            return;
        }

        const lang = parts[1];
        // Title starts after the second hyphen
        const titleSlug = id.substring(id.indexOf(lang) + lang.length + 1);
        const title = titleSlug.replace(/_/g, ' ');

        const previewData = await wikipediaService.getArticlePreview(lang, title);

        res.json({
            success: true,
            data: previewData
        });
    } catch (error: any) {
        console.error('Wikipedia preview controller error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch Wikipedia preview'
        });
    }
}
