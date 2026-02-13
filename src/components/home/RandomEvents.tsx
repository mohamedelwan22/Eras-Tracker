import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Shuffle } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getRandomEvents } from '@/config/api';
import { Event } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function RandomEvents() {
    const { t } = useApp();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const fetchRandomEvents = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            setError(null);
            const response = await getRandomEvents(12);

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

    // Handle Auto-Refresh
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoRefresh && !refreshing && !loading) {
            interval = setInterval(() => {
                fetchRandomEvents(true);
            }, 30000); // 30 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, refreshing, loading, fetchRandomEvents]);

    if (loading && events.length === 0) {
        return (
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div className="text-center md:text-left">
                            <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-2 mx-auto md:mx-0" />
                            <div className="h-5 w-48 bg-muted animate-pulse rounded-md mx-auto md:mx-0" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-card rounded-2xl h-[350px] animate-pulse border border-border" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-muted/20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 opacity-20">
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="text-center mb-8">
                        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                            <span className="text-gradient">Discover Random Events</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Explore randomly selected historic moments that shaped our world.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                        <Button
                            size="lg"
                            onClick={() => fetchRandomEvents(true)}
                            disabled={refreshing || loading}
                            className="gap-3 h-12 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <motion.div
                                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                    repeat: refreshing ? Infinity : 0
                                }}
                            >
                                <Shuffle className="w-5 h-5" />
                            </motion.div>
                            {refreshing ? 'Refreshing...' : 'Shuffle Discovery'}
                        </Button>

                        <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm border border-border p-2 px-4 rounded-full h-12 shadow-sm">
                            <Switch
                                id="auto-refresh"
                                checked={autoRefresh}
                                onCheckedChange={setAutoRefresh}
                            />
                            <Label htmlFor="auto-refresh" className="cursor-pointer text-sm font-medium pr-1">
                                Auto Refresh <span className="text-[10px] text-primary opacity-70 ml-1">(30s)</span>
                            </Label>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-destructive/20 text-center max-w-2xl mx-auto"
                        >
                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
                            <p className="text-muted-foreground mb-6">{error}</p>
                            <Button
                                variant="outline"
                                onClick={() => fetchRandomEvents()}
                                className="rounded-full"
                            >
                                <RefreshCw className="w-4 h-4 me-2" />
                                Retry Connection
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={events.map(e => e.id).join(',')} // Force re-animation on new results
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {events.map((event, index) => (
                                <motion.div key={event.id} variants={itemVariants}>
                                    <EventCard event={event} index={index} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
