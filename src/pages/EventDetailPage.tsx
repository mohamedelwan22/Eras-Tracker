import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Share2, Tag } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { getEventById, searchEvents } from '@/lib/api';
import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useApp();
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getEventById(id);
        if (response.success) {
          setEvent(response.data);
          
          // Fetch related events
          if (response.data.relatedEventIds?.length) {
            const relatedRes = await searchEvents({
              year: response.data.date.year,
              category: response.data.category,
              limit: 3,
            });
            if (relatedRes.success) {
              setRelatedEvents(
                relatedRes.data.events.filter((e) => e.id !== id).slice(0, 3)
              );
            }
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="aspect-video bg-muted rounded-2xl" />
            <div className="h-12 w-3/4 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Event not found</h1>
          <Button asChild>
            <Link to="/search">{t('search.title')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLocalizedTitle(),
          text: getLocalizedDescription(),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Layout>
      <article className="py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/results"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('event.backToResults')}
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Header Image */}
            {event.imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-video rounded-2xl overflow-hidden mb-8"
              >
                <img
                  src={event.imageUrl}
                  alt={getLocalizedTitle()}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-6 start-6 flex gap-2">
                  <span className="category-badge">
                    {t(`category.${event.category}`)}
                  </span>
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', importanceColors[event.importance])}>
                    {event.importance}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {getLocalizedTitle()}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{formatDate()}</span>
                </div>
                {event.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{event.country}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ms-auto"
                >
                  <Share2 className="w-4 h-4 me-2" />
                  {t('event.share')}
                </Button>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg leading-relaxed text-foreground">
                  {getLocalizedDescription()}
                </p>
              </div>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {event.sources.length > 0 && (
                <div className="bg-muted/50 rounded-2xl p-6 mb-12">
                  <h3 className="font-display text-xl font-semibold mb-4">
                    {t('event.sources')}
                  </h3>
                  <ul className="space-y-3">
                    {event.sources.map((source, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ExternalLink className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {source.title}
                          </a>
                        ) : (
                          <span className="text-foreground">{source.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-display text-2xl font-semibold mb-6">
                  {t('event.relatedEvents')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}
