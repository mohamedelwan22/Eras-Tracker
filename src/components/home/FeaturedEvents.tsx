import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { getFeaturedEvents } from '@/lib/api';
import { Event } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function FeaturedEvents() {
    const { t } = useApp();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getFeaturedEvents();
                if (isMounted) {
                    if (response.success) {
                        setEvents(response.data.events);
                    } else {
                        setError(response.error || 'Failed to load featured events');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('An unexpected error occurred');
                    console.error('FeaturedEvents Error:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchEvents();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    if (loading) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse border border-border" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center p-12 bg-destructive/5 rounded-3xl border border-destructive/20 text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t('common.error')}</h3>
                        <p className="text-muted-foreground">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return null; // Don't show the section if no featured events
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                            {t('nav.search')}
                        </h2>
                        <p className="text-muted-foreground">{t('hero.description')}</p>
                    </div>
                    <Button variant="outline" asChild className="hidden sm:flex gap-2 text-primary hover:text-primary">
                        <Link to="/search">
                            {t('common.viewAll')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </motion.div>

                <div className="mt-10 flex sm:hidden justify-center">
                    <Button variant="outline" asChild className="w-full gap-2">
                        <Link to="/search">
                            {t('common.viewAll')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
