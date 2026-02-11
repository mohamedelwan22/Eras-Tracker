import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Event, EventCategory } from '@/lib/types';
import { stripHtml } from '@/utils/stripHtml';

interface RelatedEventCardProps {
    event: Event;
}

export function RelatedEventCard({ event }: RelatedEventCardProps) {
    const { t, locale } = useApp();

    const getFallbackImage = (cat: EventCategory) => {
        const fallbacks: Record<string, string> = {
            war: 'https://images.unsplash.com/photo-1505373633519-c0ae2f1b490f',
            science: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
            culture: 'https://images.unsplash.com/photo-1467307983825-619715426c70',
            politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620',
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
        return (fallbacks[cat] || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa') + '?q=80&w=800&auto=format&fit=crop';
    };

    const title = locale === 'ar' ? event.titleAr || event.title :
        locale === 'fr' ? event.titleFr || event.title :
            event.title;

    const imageUrl = event.imageUrl || getFallbackImage(event.category);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group"
        >
            <Link to={`/event/${event.id}`} state={{ event }} className="block h-full">
                <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img
                            src={imageUrl}
                            alt={stripHtml(title)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary font-bold text-xs">
                                {event.date.year} {event.date.era}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                {t(`category.${event.category}`)}
                            </span>
                        </div>
                        <h4 className="font-display font-bold text-lg leading-tight line-clamp-2 text-start group-hover:text-primary transition-colors">
                            {stripHtml(title)}
                        </h4>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
