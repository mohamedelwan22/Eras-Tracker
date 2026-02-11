import { motion, AnimatePresence } from 'framer-motion';
import { SearchResultCard } from './SearchResultCard';
import { Event } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
    events: Event[];
    loading: boolean;
    error: string | null;
    total: number;
    onRetry: () => void;
}

export function SearchResults({ events, loading, error, total, onRetry }: SearchResultsProps) {
    const { t } = useApp();

    return (
        <div className="space-y-6 relative">
            {/* Soft Error Overlay */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            <p className="text-sm font-medium text-destructive-foreground">{error}</p>
                        </div>
                        <Button
                            onClick={onRetry}
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2 hover:bg-destructive/10"
                        >
                            <RefreshCw className="w-3 h-3 text-destructive" />
                            <span className="text-destructive font-bold">{t('common.retry')}</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && events.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-card rounded-2xl h-64 animate-pulse border border-border" />
                    ))}
                </div>
            ) : !loading && events.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 px-4 bg-muted/30 rounded-3xl border border-dashed border-border"
                >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{t('results.noResults')}</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        {t('results.noResultsSuggestion')}
                    </p>
                </motion.div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-muted-foreground">
                            {t('results.found', { count: total })}
                        </h2>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {events.map((event, index) => (
                            <SearchResultCard key={event.id} event={event} index={index} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
