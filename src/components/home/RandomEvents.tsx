import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { getRandomEvents } from '@/lib/api';
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

export function RandomEvents() {
    const { t } = useApp();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRandomEvents = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            setError(null);
            const response = await getRandomEvents(3);

            if (response.success) {
                setEvents(response.data.events);
            } else {
                setError(response.error || 'Failed to load random events');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('RandomEvents Error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchRandomEvents();
    }, [fetchRandomEvents]);

    if (loading) {
        return (
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse border border-border" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t('common.error')}</h3>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button
                            variant="outline"
                            onClick={() => fetchRandomEvents()}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 me-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Retry
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                            Discover Something New
                        </h2>
                        <p className="text-muted-foreground">Randomly selected historic events just for you</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => fetchRandomEvents(true)}
                        disabled={refreshing}
                        className="gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh Events</span>
                    </Button>
                </motion.div>

                <motion.div
                    key={events.map(e => e.id).join(',')} // Force re-animation on refresh
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
            </div>
        </section>
    );
}
