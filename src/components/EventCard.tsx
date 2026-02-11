import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Event } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { stripHtml } from '@/utils/stripHtml';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const { locale, t } = useApp();

  const getLocalizedTitle = () => {
    let title = event.title;
    if (locale === 'ar' && event.titleAr) title = event.titleAr;
    else if (locale === 'fr' && event.titleFr) title = event.titleFr;
    return stripHtml(title);
  };

  const getLocalizedDescription = () => {
    let description = event.description;
    if (locale === 'ar' && event.descriptionAr) description = event.descriptionAr;
    else if (locale === 'fr' && event.descriptionFr) description = event.descriptionFr;
    return stripHtml(description);
  };

  const getFallbackImage = (category: string) => {
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
      default: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
    };
    return `${fallbacks[category] || fallbacks.default}?q=80&w=1200&auto=format&fit=crop`;
  };

  const importanceColors = {
    low: 'text-slate-500 bg-slate-500/10',
    medium: 'text-blue-500 bg-blue-500/10',
    high: 'text-orange-500 bg-orange-500/10',
    critical: 'text-red-500 bg-red-500/10',
  };

  const imageUrl = event.imageUrl || getFallbackImage(event.category);

  const isExternal = String(event.id).startsWith('wiki-') || (event.sources && event.sources.some(s => s.title.toLowerCase().includes('wikipedia')));

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    const to = isExternal ? `/preview/${event.id}` : `/event/${event.id}`;
    return (
      <Link to={to} state={{ event }} className="block h-full">
        {children}
      </Link>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <CardWrapper>
        <motion.article
          className="group grid grid-cols-1 md:grid-cols-12 bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 h-full"
          whileHover={{ y: -2 }}
        >
          {/* Image Part - 40% on Desktop */}
          <div className="md:col-span-4 relative aspect-video md:aspect-auto overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={getLocalizedTitle()}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content Part - 60% on Desktop */}
          <div className="md:col-span-8 p-6 md:p-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-primary font-bold text-sm tracking-wider uppercase text-start">
                {event.date.year} {event.date.era}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-tight">
                {t(`category.${event.category}`)}
              </span>
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest', importanceColors[event.importance])}>
                {event.importance}
              </span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground line-clamp-2 leading-tight mb-4 group-hover:text-primary transition-colors text-start">
              {getLocalizedTitle()}
            </h3>

            <p className="text-muted-foreground text-base leading-relaxed text-start mb-6 line-clamp-3">
              {getLocalizedDescription()}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {event.country && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{event.country}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-primary text-sm font-bold group-hover:gap-2.5 transition-all rtl:flex-row-reverse">
                {t('articles.readMore')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </div>
          </div>
        </motion.article>
      </CardWrapper>
    </motion.div>
  );
}
