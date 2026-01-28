import { Router } from 'express';
import * as searchController from '../controllers/searchController.js';
import * as eventController from '../controllers/eventController.js';
import * as articleController from '../controllers/articleController.js';

const router = Router();

// Search endpoints
router.post('/search', searchController.searchEvents);
router.get('/random', searchController.getRandomEvents);
router.get('/featured', searchController.getFeaturedEvents);
router.get('/on-this-day', searchController.getOnThisDay);

// Event endpoints
router.get('/event/:id', eventController.getEventById);

// Article endpoints
router.get('/articles', articleController.getArticles);
router.get('/articles/:slug', articleController.getArticleBySlug);

export { router as apiRouter };
