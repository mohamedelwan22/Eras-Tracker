import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Event, Locale } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const { locale, t } = useApp();

  const getLocalizedTitle = () => {
    if (locale === 'ar' && event.titleAr) return event.titleAr;
    if (locale === 'fr' && event.titleFr) return event.titleFr;
    return event.title;
  };

  const getLocalizedDescription = () => {
    if (locale === 'ar' && event.descriptionAr) return event.descriptionAr;
    if (locale === 'fr' && event.descriptionFr) return event.descriptionFr;
    return event.description;
  };

  const formatDate = () => {
    const { year, month, day, era } = event.date;
    const parts = [];
    if (day) parts.push(day);
    if (month) parts.push(t(`month.${month}`));
    parts.push(Math.abs(year));
    if (era === 'BCE') parts.push('BCE');
    return parts.join(' ');
  };

  const importanceColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-secondary/20 text-secondary',
    high: 'bg-primary/20 text-primary',
    critical: 'bg-primary text-primary-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/event/${event.id}`}>
        <motion.article
          className="group bg-card rounded-2xl overflow-hidden border border-border card-hover h-full"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image */}
          {event.imageUrl && (
            <div className="relative aspect-video overflow-hidden">
              <img
                src={event.imageUrl}
                alt={getLocalizedTitle()}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-4 start-4">
                <span className="category-badge">
                  {t(`category.${event.category}`)}
                </span>
              </div>
              
              {/* Importance Badge */}
              <div className="absolute top-4 end-4">
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', importanceColors[event.importance])}>
                  {event.importance}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {getLocalizedTitle()}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2">
              {getLocalizedDescription()}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate()}</span>
              </div>
              {event.country && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{event.country}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {event.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
