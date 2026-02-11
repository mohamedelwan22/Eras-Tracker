const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing Wikipedia cache...');
  const result = await prisma.cachedSearch.deleteMany({
    where: {
      OR: [
        { queryHash: { contains: 'on-this-day' } },
        { queryHash: { contains: 'wiki' } },
        { results: { contains: 'wiki-' } }
      ]
    }
  });
  console.log(`Cleared ${result.count} entries.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
