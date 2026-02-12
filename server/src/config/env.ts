import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    corsOrigin: process.env.CORS_ORIGIN || 'https://eratracker.com',
    redisUrl: process.env.REDIS_URL,
} as const;

export type Config = typeof config;
