import { app } from './app.js';
import { config } from './config/env.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected');

        // Start server
        app.listen(config.port, () => {
            console.log(`🚀 Server running on port ${config.port}`);
            console.log(`📍 Environment: ${config.env}`);
            console.log(`🔗 API: http://localhost:${config.port}/api`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('\n👋 Server shut down gracefully');
    process.exit(0);
});

main();
