import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchPagination } from '@/components/search/SearchPagination';
import { searchEvents } from '@/lib/api';
import { Event, SearchParams } from '@/lib/types';
import { Helmet } from 'react-helmet-async';
import { buildTitle, buildDescription, buildCanonicalUrl } from '@/utils/seo';

export default function SearchPage() {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Derive initial params from URL
  const getParamsFromUrl = useCallback((): SearchParams => {
    return {
      query: searchParams.get('query') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      category: searchParams.get('category') as any || undefined,
      country: searchParams.get('country') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'date',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: 12,
    };
  }, [searchParams]);

  const handleSearch = useCallback(async (params: SearchParams) => {
    // Update URL params
    const newUrlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        newUrlParams.set(key, String(value));
      }
    });
    setSearchParams(newUrlParams);

    // Guard: Prevent double loading but allow Abort
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    // Note: We don't clear error here to avoid flickering UI, 
    // unless it's a completely new search term (handled by UI)

    try {
      const response = await searchEvents(params, { signal: controller.signal });

      if (response.success) {
        // Validate response
        if (!response.data || !Array.isArray(response.data.events)) {
          throw new Error("Invalid backend response");
        }

        setEvents(response.data.events);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
        setError(null);
      } else {
        // HTTP 400 is treated as "No results" for UX stability
        if (response.error?.includes('400')) {
          setEvents([]);
          setTotal(0);
          setTotalPages(1);
          setError(null);
        } else {
          setError(response.error || t('common.error'));
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'canceled') {
        return; // Ignore aborted requests
      }
      setError(t('common.error'));
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams, t]);

  // Initial fetch or fetch on URL change
  const currentParams = getParamsFromUrl();
  const searchKey = JSON.stringify(currentParams);

  useEffect(() => {
    if (currentParams.year || currentParams.query) {
      handleSearch(currentParams);
    }
    
    return () => abortControllerRef.current?.abort();
  }, [searchKey, handleSearch]); // Uses stable searchKey

  const onPageChange = (page: number) => {
    handleSearch({ ...currentParams, page });
  };

  const dynamicTitle = currentParams.year || currentParams.query
    ? `${t('search.title')} - ${currentParams.year || ''} ${currentParams.query || ''}`.trim()
    : t('search.title');

  return (
    <Layout>
      <Helmet>
        <title>{buildTitle(dynamicTitle)}</title>
        <meta name="description" content={buildDescription(`ابحث في التاريخ والعلوم عبر العصور. ${dynamicTitle}`)} />
        <link rel="canonical" href={buildCanonicalUrl('/search')} />
        {(!currentParams.year && !currentParams.query) && <meta name="robots" content="noindex" />}
      </Helmet>
      <section className="py-12 sm:py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[10%] w-[30%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[45%] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              >
                <span className="text-gradient">{t('search.title')}</span>
              </motion.h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Discover history, science, and the events that shaped our world.
              </p>
            </div>

            {/* Search Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/70 backdrop-blur-sm rounded-3xl border border-border/50 p-6 sm:p-10 shadow-2xl shadow-primary/5 mb-16"
            >
              <SearchForm
                onSearch={handleSearch}
                initialValues={currentParams}
                isLoading={loading}
              />
            </motion.div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
              {currentParams.year || currentParams.query ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  <SearchResults
                    events={events}
                    loading={loading}
                    error={error}
                    total={total}
                    onRetry={() => handleSearch(currentParams)}
                  />

                  <SearchPagination
                    currentPage={currentParams.page || 1}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    isLoading={loading}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Begin Your Journey</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Enter a year above to explore historical events, scientific breakthroughs, and world-changing discoveries from that era.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
