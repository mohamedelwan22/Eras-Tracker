import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchEvents } from '@/config/api';
import { Event, SearchParams } from '@/lib/types';

export default function ResultsPage() {
  const { t } = useApp();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const params: SearchParams = {
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear(),
    month: searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined,
    day: searchParams.get('day') ? parseInt(searchParams.get('day')!) : undefined,
    category: searchParams.get('category') as any,
    country: searchParams.get('country') || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 12,
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await searchEvents(params);
        if (response.success) {
          setEvents(response.data.events);
          setTotal(response.data.total);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams, sortBy, sortOrder, page]);

  const getSearchSummary = () => {
    const parts = [];
    if (params.year) parts.push(`Year: ${params.year}`);
    if (params.month) parts.push(`Month: ${t(`month.${params.month}`)}`);
    if (params.day) parts.push(`Day: ${params.day}`);
    if (params.category) parts.push(`Category: ${t(`category.${params.category}`)}`);
    if (params.country) parts.push(`Country: ${params.country}`);
    return parts.join(' • ') || 'All events';
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('event.backToResults')}
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                  {t('results.title')}
                </h1>
                <p className="text-muted-foreground">
                  {getSearchSummary()}
                </p>
                <p className="text-sm text-primary font-medium mt-1">
                  {t('results.found', { count: total })}
                </p>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t('results.sortBy')}:</span>
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="date">{t('results.sortByDate')}</SelectItem>
                    <SelectItem value="importance">{t('results.sortByImportance')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl h-80 animate-pulse border border-border" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-2">
                {t('results.noResults')}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('results.noResultsSuggestion')}
              </p>
              <Button asChild>
                <Link to="/search">{t('search.title')}</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
