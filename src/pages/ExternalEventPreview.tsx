import { useEffect, useState } from 'react';
import { useLocation, Navigate, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowLeft, MapPin, Loader2, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { stripHtml } from '@/utils/stripHtml';
import { Event, WikiPreviewData } from '@/lib/types';
import { getWikipediaPreview } from '@/lib/api';

export default function ExternalEventPreview() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const { t, locale } = useApp();

    const [enrichedData, setEnrichedData] = useState<WikiPreviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const event = state?.event as Event | undefined;

    useEffect(() => {
        const fetchPreview = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Optimization: If we have state and the ID is the old random format,
                // we can try to "self-heal" by using the title from state.
                let searchId = id;
                if (event && id.split('-').length > 3 && !isNaN(Number(id.split('-')[2]))) {
                    // Looks like an old ID with date/random parts
                    const lang = id.split('-')[1];
                    const titleSlug = event.title.replace(/ /g, '_');
                    searchId = `wiki-${lang}-${titleSlug}`;
                }

                const response = await getWikipediaPreview(searchId);
                if (response.success) {
                    setEnrichedData(response.data);
                } else {
                    console.warn('Enrichment failed, falling back to basic data:', response.error);
                    // Don't set global error if we have basic event data to show
                    if (!event) setError(response.error || 'Failed to load preview');
                }
            } catch (err) {
                console.error('Fetch preview error:', err);
                if (!event) setError('An unexpected error occurred while loading the preview.');
            } finally {
                setLoading(false);
            }
        };

        fetchPreview();
    }, [id, event]);

    if (!event && !loading && !enrichedData) {
        return <Navigate to="/search" replace />;
    }

    const title = enrichedData?.title || (event ? (locale === 'ar' ? event.titleAr || event.title : event.title) : '');
    const imageUrl = enrichedData?.imageUrl || event?.imageUrl;
    const content = enrichedData?.previewContent || (event ? stripHtml(event.description) : '');
    const externalUrl = enrichedData?.sourceUrl || event?.sources?.[0]?.url;

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Link
                        to="#"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                        <span>{t('event.backToResults')}</span>
                    </Link>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-24 gap-4"
                            >
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <p className="text-muted-foreground font-medium animate-pulse">
                                    {t('common.loading')}
                                </p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-destructive/10 border border-destructive/20 rounded-3xl p-8 text-center"
                            >
                                <Info className="w-12 h-12 text-destructive mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-foreground mb-2">Oops!</h2>
                                <p className="text-muted-foreground mb-6">{error}</p>
                                <Button onClick={() => window.location.reload()}>{t('common.retry')}</Button>
                            </motion.div>
                        ) : (
                            <motion.article
                                key="content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12 pb-20"
                            >
                                {/* Immersive Header Image */}
                                <div className="aspect-[21/10] relative overflow-hidden rounded-3xl bg-muted shadow-2xl group">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                                </div>

                                <div className="max-w-3xl mx-auto">
                                    <div className="flex flex-wrap items-center gap-4 mb-8">
                                        {event?.date && (
                                            <span className="text-primary font-bold text-xl tracking-tight uppercase">
                                                {event.date.year} {event.date.era}
                                            </span>
                                        )}
                                        <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                        {event?.category && (
                                            <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-widest">
                                                {t(`category.${event.category}`)}
                                            </span>
                                        )}
                                        {event?.country && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span>{event.country}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-12 leading-[1.1] text-start tracking-tight drop-shadow-sm">
                                        {title}
                                    </h1>

                                    <div className="prose prose-xl dark:prose-invert max-w-none text-start text-foreground/90 leading-relaxed mb-16 font-serif">
                                        <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:float-start first-letter:me-4 first-letter:mt-2 first-letter:leading-none whitespace-pre-line">
                                            {content}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-8 py-12 border-y border-border/50">
                                        <div className="text-center sm:text-start w-full">
                                            <p className="text-lg text-foreground font-semibold mb-2">
                                                {t('event.readFullOnWikipedia')}
                                            </p>
                                            <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-2xl border border-border/50">
                                                {enrichedData?.attribution || "هذا المحتوى مقتطف من ويكيبيديا. جميع الحقوق محفوظة لمؤلفي ويكيبيديا."}
                                            </p>
                                        </div>

                                        <Button
                                            asChild
                                            size="lg"
                                            className="w-full sm:w-auto text-xl h-16 px-10 rounded-2xl gap-3 font-bold shadow-xl shadow-primary/25 hover:scale-[1.02] transition-all bg-primary hover:bg-primary/90"
                                        >
                                            <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                                                <span>{t('event.readFullOnWikipedia')}</span>
                                                <ExternalLink className="w-6 h-6" />
                                            </a>
                                        </Button>

                                        <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-50">
                                            Wikipedia.org &bull; {new Date().getFullYear()}
                                        </p>
                                    </div>
                                </div>
                            </motion.article>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
}
