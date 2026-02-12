import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { getEventById } from '@/config/api';
import { Event } from '@/lib/types';

// New Components
import { EventHero } from '@/components/event/EventHero';
import { EventMeta } from '@/components/event/EventMeta';
import { EventContent } from '@/components/event/EventContent';
import { EventSources } from '@/components/event/EventSources';
import { EventTags } from '@/components/event/EventTags';
import { RelatedEvents } from '@/components/event/RelatedEvents';
import { Helmet } from 'react-helmet-async';
import { buildTitle, buildDescription, buildCanonicalUrl, buildOgImage } from '@/utils/seo';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useApp();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      // Safety rule: wiki- events go to /preview
      if (id.startsWith('wiki-')) {
        return; // Handled by Navigate below
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getEventById(id);
        if (response.success) {
          setEvent(response.data);
        } else {
          setError(response.error || 'Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Mandatory Safety Rule
  if (id?.startsWith('wiki-')) {
    return <Navigate to={`/preview/${id}`} replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">{t('common.loading')}</p>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <Info className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">{error || 'Event not found'}</h1>
          <p className="text-muted-foreground mb-8">
            The event you are looking for might have been removed or the ID is incorrect.
          </p>
          <Button asChild size="lg" className="rounded-xl">
            <Link to="/search">{t('event.backToResults')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const title = locale === 'ar' ? event.titleAr || event.title :
    locale === 'fr' ? event.titleFr || event.title :
      event.title;

  const description = locale === 'ar' ? event.descriptionAr || event.description :
    locale === 'fr' ? event.descriptionFr || event.description :
      event.description;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Event", "Article"],
    "name": title,
    "description": buildDescription(description),
    "image": buildOgImage(event.imageUrl),
    "datePublished": event.createdAt,
    "dateModified": event.updatedAt,
    "headline": title,
    "articleBody": description,
    "location": {
      "@type": "Place",
      "name": event.country || "Global"
    },
    "startDate": `${event.date.year}-01-01`
  };

  return (
    <Layout>
      <Helmet>
        <title>{buildTitle(`${title} (${event.date.year} ${event.date.era})`)}</title>
        <meta name="description" content={buildDescription(description)} />
        <link rel="canonical" href={buildCanonicalUrl(`/event/${id}`)} />
        <meta property="og:title" content={buildTitle(title)} />
        <meta property="og:description" content={buildDescription(description)} />
        <meta property="og:image" content={buildOgImage(event.imageUrl)} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Floating Back Button */}
        <div className="absolute top-24 left-4 z-50 md:fixed">
          <div className="container mx-auto px-4">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span className="font-medium text-sm">{t('event.backToResults')}</span>
            </Link>
          </div>
        </div>

        <article className="pb-24">
          <EventHero
            title={title}
            imageUrl={event.imageUrl}
            category={event.category}
          />

          <div className="container mx-auto px-4 max-w-4xl">
            <EventMeta
              year={event.date.year}
              era={event.date.era}
              category={event.category}
              importance={event.importance}
              country={event.country}
            />

            <EventContent content={description} />

            <EventTags tags={event.tags} />

            <EventSources sources={event.sources} />

            <RelatedEvents currentEvent={event} />
          </div>
        </article>
      </div>
    </Layout>
  );
}
