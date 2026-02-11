import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { getOnThisDay } from '@/lib/api';
import { Event } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';

export function OnThisDay() {
    const { t } = useApp();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getOnThisDay(month, day);
                if (isMounted) {
                    if (response.success) {
                        // We'll show the top 3 events for the preview
                        setEvents(response.data.events.slice(0, 3));
                    } else {
                        setError(response.error || 'Failed to load events for today');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('An unexpected error occurred');
                    console.error('OnThisDay Error:', err);
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
        };
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse border border-border" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center p-12 bg-destructive/5 rounded-3xl border border-destructive/20 text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t('common.error')}</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                            {t('nav.onThisDay')}
                        </h2>
                        <p className="text-muted-foreground">
                            {t('onThisDay.subtitle', {
                                date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
                            })}
                        </p>
                    </div>
                    <Button variant="outline" asChild className="hidden sm:flex gap-2">
                        <Link to="/on-this-day">
                            {t('common.viewAll')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </div>

                <div className="mt-10 flex sm:hidden justify-center">
                    <Button variant="outline" asChild className="w-full gap-2">
                        <Link to="/on-this-day">
                            {t('common.viewAll')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
