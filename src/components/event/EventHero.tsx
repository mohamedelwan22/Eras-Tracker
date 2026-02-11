import { motion } from 'framer-motion';
import { EventCategory } from '@/lib/types';

interface EventHeroProps {
    title: string;
    imageUrl?: string;
    category: EventCategory;
}

export function EventHero({ title, imageUrl, category }: EventHeroProps) {
    const getFallbackImage = (cat: EventCategory) => {
        const fallbacks: Record<string, string> = {
            war: 'https://images.unsplash.com/photo-1505373633519-c0ae2f1b490f', // Battlefield
            science: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31', // Laboratory
            culture: 'https://images.unsplash.com/photo-1467307983825-619715426c70', // Manuscripts
            politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620', // Government Halls
            discovery: 'https://images.unsplash.com/photo-1500076656116-558758c991c1',
            space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
            natural_disaster: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2',
            medicine: 'https://images.unsplash.com/photo-1576091160550-217359f488d5',
            religion: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
            economics: 'https://images.unsplash.com/photo-1611974717482-58a00f9397f0',
            sports: 'https://images.unsplash.com/photo-1461896756913-7597af659228',
            art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
            literature: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
        };
        return (fallbacks[cat] || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa') + '?q=80&w=2000&auto=format&fit=crop';
    };

    const heroImage = imageUrl || getFallbackImage(category);

    return (
        <div className="relative w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden">
            <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-20">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="font-display text-4xl md:text-6xl lg:text-8xl font-bold text-foreground max-w-5xl leading-[1.1] tracking-tight text-start drop-shadow-2xl"
                    >
                        {title}
                    </motion.h1>
                </div>
            </div>
        </div>
    );
}
