import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing Wikipedia and On-This-Day cache...');
    const result = await prisma.cachedSearch.deleteMany({
        where: {
            OR: [
                { queryHash: { contains: 'on-this-day' } },
                { queryHash: { contains: 'wiki' } }
            ]
        }
    });
    console.log(`Cleared ${result.count} cache entries.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
