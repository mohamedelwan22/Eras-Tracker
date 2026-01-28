import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed data from frontend mocks (src/lib/mocks.ts)
const mockEvents = [
    {
        id: '1',
        title: 'Moon Landing',
        titleAr: 'الهبوط على القمر',
        titleFr: 'Alunissage',
        description: 'Apollo 11 successfully landed the first humans on the Moon. Neil Armstrong became the first person to walk on the lunar surface, followed by Buzz Aldrin.',
        descriptionAr: 'نجح أبولو 11 في إنزال أول البشر على سطح القمر. أصبح نيل أرمسترونغ أول شخص يمشي على سطح القمر، تلاه باز ألدرين.',
        descriptionFr: "Apollo 11 a réussi à faire atterrir les premiers humains sur la Lune. Neil Armstrong est devenu la première personne à marcher sur la surface lunaire, suivi de Buzz Aldrin.",
        year: 1969,
        month: 7,
        day: 20,
        era: 'CE',
        category: 'space',
        country: 'United States',
        countryCode: 'US',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
        importance: 'critical',
        sources: [
            { title: 'NASA Archives', url: 'https://www.nasa.gov/mission_pages/apollo/apollo-11.html' },
            { title: 'Smithsonian National Air and Space Museum' }
        ],
        relatedEventIds: ['2', '3'],
        tags: ['space', 'apollo', 'moon', 'nasa'],
    },
    {
        id: '2',
        title: 'First Human in Space',
        titleAr: 'أول إنسان في الفضاء',
        titleFr: "Premier humain dans l'espace",
        description: 'Yuri Gagarin became the first human to journey into outer space when his Vostok spacecraft completed an orbit of the Earth.',
        descriptionAr: 'أصبح يوري غاغارين أول إنسان يسافر إلى الفضاء الخارجي عندما أكملت مركبته فوستوك دورة حول الأرض.',
        descriptionFr: "Youri Gagarine est devenu le premier humain à voyager dans l'espace lorsque son vaisseau Vostok a effectué une orbite autour de la Terre.",
        year: 1961,
        month: 4,
        day: 12,
        era: 'CE',
        category: 'space',
        country: 'Russia',
        countryCode: 'RU',
        imageUrl: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800',
        importance: 'high',
        sources: [{ title: 'ESA History' }],
        relatedEventIds: ['1'],
        tags: ['space', 'gagarin', 'soviet', 'first'],
    },
    {
        id: '3',
        title: 'Discovery of Penicillin',
        titleAr: 'اكتشاف البنسلين',
        titleFr: 'Découverte de la pénicilline',
        description: 'Alexander Fleming discovered penicillin, the first true antibiotic, which would go on to save millions of lives.',
        descriptionAr: 'اكتشف ألكسندر فليمنج البنسلين، أول مضاد حيوي حقيقي، والذي سينقذ ملايين الأرواح.',
        descriptionFr: 'Alexander Fleming a découvert la pénicilline, le premier véritable antibiotique, qui allait sauver des millions de vies.',
        year: 1928,
        month: 9,
        day: 28,
        era: 'CE',
        category: 'medicine',
        country: 'United Kingdom',
        countryCode: 'GB',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
        importance: 'high',
        sources: [{ title: 'Nobel Prize Archives' }],
        relatedEventIds: [],
        tags: ['medicine', 'antibiotic', 'discovery'],
    },
    {
        id: '4',
        title: 'Fall of the Berlin Wall',
        titleAr: 'سقوط جدار برلين',
        titleFr: 'Chute du mur de Berlin',
        description: 'The Berlin Wall, which had divided East and West Berlin since 1961, was opened, leading to the reunification of Germany.',
        descriptionAr: 'تم فتح جدار برلين الذي قسم برلين الشرقية والغربية منذ عام 1961، مما أدى إلى إعادة توحيد ألمانيا.',
        descriptionFr: "Le mur de Berlin, qui divisait Berlin-Est et Berlin-Ouest depuis 1961, a été ouvert, menant à la réunification de l'Allemagne.",
        year: 1989,
        month: 11,
        day: 9,
        era: 'CE',
        category: 'politics',
        country: 'Germany',
        countryCode: 'DE',
        imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
        importance: 'critical',
        sources: [{ title: 'German Historical Institute' }],
        relatedEventIds: [],
        tags: ['politics', 'cold war', 'germany', 'reunification'],
    },
    {
        id: '5',
        title: 'Theory of Relativity Published',
        titleAr: 'نشر نظرية النسبية',
        titleFr: 'Publication de la théorie de la relativité',
        description: 'Albert Einstein published his theory of general relativity, fundamentally changing our understanding of space, time, and gravity.',
        descriptionAr: 'نشر ألبرت أينشتاين نظريته النسبية العامة، مما غير فهمنا للفضاء والزمن والجاذبية بشكل جذري.',
        descriptionFr: "Albert Einstein a publié sa théorie de la relativité générale, changeant fondamentalement notre compréhension de l'espace, du temps et de la gravité.",
        year: 1915,
        month: 11,
        day: 25,
        era: 'CE',
        category: 'science',
        country: 'Germany',
        countryCode: 'DE',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        importance: 'critical',
        sources: [{ title: 'Physical Review Letters Archives' }],
        relatedEventIds: [],
        tags: ['science', 'physics', 'einstein', 'relativity'],
    },
    {
        id: '6',
        title: 'First Powered Flight',
        titleAr: 'أول رحلة طيران بمحرك',
        titleFr: 'Premier vol motorisé',
        description: 'The Wright Brothers achieved the first powered, controlled flight at Kitty Hawk, North Carolina.',
        descriptionAr: 'حقق الأخوان رايت أول رحلة طيران بمحرك والتي يتم التحكم فيها في كيتي هوك، نورث كارولينا.',
        descriptionFr: 'Les frères Wright ont réalisé le premier vol motorisé et contrôlé à Kitty Hawk, en Caroline du Nord.',
        year: 1903,
        month: 12,
        day: 17,
        era: 'CE',
        category: 'invention',
        country: 'United States',
        countryCode: 'US',
        imageUrl: 'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=800',
        importance: 'medium',
        sources: [{ title: 'Smithsonian National Air and Space Museum' }],
        relatedEventIds: [],
        tags: ['aviation', 'invention', 'wright brothers'],
    },
    {
        id: '7',
        title: 'Invention of the Printing Press',
        titleAr: 'اختراع المطبعة',
        titleFr: "Invention de l'imprimerie",
        description: 'Johannes Gutenberg invented the movable type printing press, revolutionizing the spread of knowledge.',
        descriptionAr: 'اخترع يوهانس غوتنبرغ المطبعة ذات الحروف المتحركة، مما أحدث ثورة في نشر المعرفة.',
        descriptionFr: "Johannes Gutenberg a inventé la presse à caractères mobiles, révolutionnant la diffusion des connaissances.",
        year: 1440,
        month: null,
        day: null,
        era: 'CE',
        category: 'invention',
        country: 'Germany',
        countryCode: 'DE',
        imageUrl: 'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=800',
        importance: 'high',
        sources: [{ title: 'Gutenberg Museum' }],
        relatedEventIds: [],
        tags: ['invention', 'printing', 'books', 'knowledge'],
    },
    {
        id: '8',
        title: 'Construction of the Great Pyramid',
        titleAr: 'بناء الهرم الأكبر',
        titleFr: 'Construction de la Grande Pyramide',
        description: 'The Great Pyramid of Giza was completed, one of the Seven Wonders of the Ancient World.',
        descriptionAr: 'اكتمل بناء الهرم الأكبر في الجيزة، أحد عجائب الدنيا السبع في العالم القديم.',
        descriptionFr: "La Grande Pyramide de Gizeh a été achevée, l'une des Sept Merveilles du monde antique.",
        year: 2560,
        month: null,
        day: null,
        era: 'BCE',
        category: 'culture',
        country: 'Egypt',
        countryCode: 'EG',
        imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
        importance: 'critical',
        sources: [{ title: 'Egyptian Ministry of Antiquities' }],
        relatedEventIds: [],
        tags: ['ancient', 'egypt', 'pyramid', 'wonder'],
    },
    {
        id: '9',
        title: 'World Wide Web Invented',
        titleAr: 'اختراع شبكة الويب العالمية',
        titleFr: 'Invention du World Wide Web',
        description: 'Tim Berners-Lee invented the World Wide Web while working at CERN, creating the foundation of the modern internet.',
        descriptionAr: 'اخترع تيم بيرنرز لي شبكة الويب العالمية أثناء عمله في سيرن، مما أسس للإنترنت الحديث.',
        descriptionFr: "Tim Berners-Lee a inventé le World Wide Web alors qu'il travaillait au CERN, créant les fondations de l'internet moderne.",
        year: 1989,
        month: 3,
        day: 12,
        era: 'CE',
        category: 'invention',
        country: 'Switzerland',
        countryCode: 'CH',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        importance: 'high',
        sources: [{ title: 'CERN Archives' }],
        relatedEventIds: [],
        tags: ['internet', 'web', 'invention', 'technology'],
    },
    {
        id: '10',
        title: 'Discovery of DNA Structure',
        titleAr: 'اكتشاف بنية الحمض النووي',
        titleFr: "Découverte de la structure de l'ADN",
        description: "James Watson and Francis Crick discovered the double helix structure of DNA, unlocking the secrets of genetic inheritance.",
        descriptionAr: 'اكتشف جيمس واتسون وفرانسيس كريك بنية الحلزون المزدوج للحمض النووي، مما كشف أسرار الوراثة الجينية.',
        descriptionFr: "James Watson et Francis Crick ont découvert la structure en double hélice de l'ADN, révélant les secrets de l'hérédité génétique.",
        year: 1953,
        month: 4,
        day: 25,
        era: 'CE',
        category: 'science',
        country: 'United Kingdom',
        countryCode: 'GB',
        imageUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800',
        importance: 'medium',
        sources: [{ title: 'Nature Journal Archives' }],
        relatedEventIds: [],
        tags: ['science', 'biology', 'dna', 'genetics'],
    },
];

const mockArticles = [
    {
        id: '1',
        slug: 'history-of-space-exploration',
        title: 'The History of Space Exploration',
        titleAr: 'تاريخ استكشاف الفضاء',
        titleFr: "L'histoire de l'exploration spatiale",
        excerpt: 'From Sputnik to Mars rovers, explore humanitys journey to the stars.',
        excerptAr: 'من سبوتنيك إلى مركبات المريخ، استكشف رحلة البشرية إلى النجوم.',
        excerptFr: "De Spoutnik aux rovers martiens, explorez le voyage de l'humanité vers les étoiles.",
        content: 'The history of space exploration began in earnest on October 4, 1957, when the Soviet Union successfully launched Sputnik 1...',
        contentAr: 'بدأ تاريخ استكشاف الفضاء بشكل جدي في 4 أكتوبر 1957، عندما أطلق الاتحاد السوفيتي بنجاح سبوتنيك 1...',
        contentFr: "L'histoire de l'exploration spatiale a véritablement commencé le 4 octobre 1957, lorsque l'Union soviétique a lancé avec succès Spoutnik 1...",
        coverImageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200',
        author: { id: '1', name: 'Dr. Sarah Chen', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        category: 'space',
        tags: ['space', 'history', 'exploration'],
        readingTime: 12,
        published: true,
        publishedAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
        id: '2',
        slug: 'ancient-civilizations-timeline',
        title: 'Ancient Civilizations: A Complete Timeline',
        titleAr: 'الحضارات القديمة: جدول زمني كامل',
        titleFr: 'Civilisations anciennes : une chronologie complète',
        excerpt: 'Journey through the great civilizations that shaped our world.',
        excerptAr: 'رحلة عبر الحضارات العظيمة التي شكلت عالمنا.',
        excerptFr: 'Voyagez à travers les grandes civilisations qui ont façonné notre monde.',
        content: 'From Mesopotamia to Rome, ancient civilizations laid the foundations for modern society...',
        contentAr: 'من بلاد ما بين النهرين إلى روما، وضعت الحضارات القديمة الأسس للمجتمع الحديث...',
        contentFr: 'De la Mésopotamie à Rome, les civilisations anciennes ont posé les fondations de la société moderne...',
        coverImageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200',
        author: { id: '2', name: 'Prof. Ahmed Hassan', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        category: 'history',
        tags: ['ancient', 'civilizations', 'history'],
        readingTime: 15,
        published: true,
        publishedAt: new Date('2024-01-10T10:00:00Z'),
    },
    {
        id: '3',
        slug: 'scientific-revolutions',
        title: 'The Scientific Revolutions That Changed Everything',
        titleAr: 'الثورات العلمية التي غيرت كل شيء',
        titleFr: 'Les révolutions scientifiques qui ont tout changé',
        excerpt: 'How key discoveries transformed our understanding of the universe.',
        excerptAr: 'كيف حولت الاكتشافات الرئيسية فهمنا للكون.',
        excerptFr: "Comment les découvertes clés ont transformé notre compréhension de l'univers.",
        content: 'From Copernicus to Einstein, scientific revolutions have fundamentally altered how we perceive reality...',
        contentAr: 'من كوبرنيكوس إلى أينشتاين، غيرت الثورات العلمية بشكل جذري كيف ندرك الواقع...',
        contentFr: 'De Copernic à Einstein, les révolutions scientifiques ont fondamentalement modifié notre perception de la réalité...',
        coverImageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
        author: { id: '3', name: 'Dr. Marie Laurent', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
        category: 'science',
        tags: ['science', 'revolution', 'physics'],
        readingTime: 10,
        published: true,
        publishedAt: new Date('2024-01-05T10:00:00Z'),
    },
];

async function main() {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.analytics.deleteMany();
    await prisma.cachedSearch.deleteMany();
    await prisma.article.deleteMany();
    await prisma.event.deleteMany();

    // Seed Events
    console.log('📅 Seeding events...');
    for (const event of mockEvents) {
        // Strip out the ID to let CUID generate (or keep it if we want fixed IDs)
        // Converting arrays/objects to JSON strings for SQLite compatibility
        // EXPLICITLY destructure array fields to avoid spread type mismatch
        const { id, sources, relatedEventIds, tags, ...eventData } = event;
        await prisma.event.create({
            data: {
                ...eventData,
                id, // Keeping fixed IDs for seeded data
                sources: JSON.stringify(sources),
                relatedEventIds: JSON.stringify(relatedEventIds),
                tags: JSON.stringify(tags),
            },
        });
    }
    console.log(`   ✅ Created ${mockEvents.length} events`);

    // Seed Articles
    console.log('📝 Seeding articles...');
    for (const article of mockArticles) {
        const { id, author, tags, ...articleData } = article;
        await prisma.article.create({
            data: {
                ...articleData,
                id,
                author: JSON.stringify(author),
                tags: JSON.stringify(tags),
            },
        });
    }
    console.log(`   ✅ Created ${mockArticles.length} articles`);

    console.log('\n✨ Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
