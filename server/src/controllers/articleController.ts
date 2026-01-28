import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { articlesParamsSchema } from '../schemas/index.js';
import type { Article, ArticlesResponse, ArticleResponse } from '../types/index.js';

const prisma = new PrismaClient();

/**
 * Transform Prisma Article to API Article format
 * 
 * MULTILINGUAL FALLBACK BEHAVIOR:
 * - titleAr falls back to title if null
 * - titleFr falls back to title if null
 * - excerptAr falls back to excerpt if null
 * - excerptFr falls back to excerpt if null
 * - contentAr falls back to content if null
 * - contentFr falls back to content if null
 */
function transformArticle(dbArticle: any): Article {
    return {
        id: dbArticle.id, // CUID string
        slug: dbArticle.slug,
        title: dbArticle.title,
        // Multilingual fallback
        titleAr: dbArticle.titleAr || dbArticle.title,
        titleFr: dbArticle.titleFr || dbArticle.title,
        excerpt: dbArticle.excerpt,
        excerptAr: dbArticle.excerptAr || dbArticle.excerpt,
        excerptFr: dbArticle.excerptFr || dbArticle.excerpt,
        content: dbArticle.content,
        contentAr: dbArticle.contentAr || dbArticle.content,
        contentFr: dbArticle.contentFr || dbArticle.content,
        coverImageUrl: dbArticle.coverImageUrl,
        author: JSON.parse(dbArticle.author || '{}'),
        category: dbArticle.category,
        tags: JSON.parse(dbArticle.tags || '[]'),
        readingTime: dbArticle.readingTime,
        publishedAt: dbArticle.publishedAt?.toISOString() || dbArticle.createdAt.toISOString(),
        updatedAt: dbArticle.updatedAt.toISOString(),
    };
}

// GET /api/articles
export async function getArticles(req: Request, res: Response, next: NextFunction) {
    try {
        const params = articlesParamsSchema.parse(req.query);

        const where = { published: true };

        const total = await prisma.article.count({ where });

        const articles = await prisma.article.findMany({
            where,
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            orderBy: { publishedAt: 'desc' },
        });

        // Unified response contract
        const response: ArticlesResponse = {
            success: true,
            data: {
                articles: articles.map(transformArticle),
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

// GET /api/articles/:slug
export async function getArticleBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params as { slug: string };

        const article = await prisma.article.findUnique({
            where: { slug },
        });

        if (!article) {
            // Unified error response
            const response: ArticleResponse = {
                success: false,
                data: null,
                error: 'Article not found',
            };
            res.status(404).json(response);
            return;
        }

        // Unified success response
        const response: ArticleResponse = {
            success: true,
            data: transformArticle(article),
            meta: {
                timestamp: new Date().toISOString(),
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
}
