import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Hero3D } from '@/components/Hero3D';
import { EventCard } from '@/components/EventCard';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFeaturedEvents, getArticles, getOnThisDay } from '@/lib/api';
import { Event, Article } from '@/lib/types';
import { categories } from '@/lib/mocks';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomePage() {
  const { t, direction } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, articlesRes, todayRes] = await Promise.all([
          getFeaturedEvents(),
          getArticles(1, 3),
          getOnThisDay(new Date().getMonth() + 1, new Date().getDate()),
        ]);

        if (featuredRes.success) setFeaturedEvents(featuredRes.data.events);
        if (articlesRes.success) setArticles(articlesRes.data.articles);
        if (todayRes.success) setTodayEvents(todayRes.data.events.slice(0, 3));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const year = parseInt(searchQuery);
      if (!isNaN(year)) {
        navigate(`/results?year=${year}`);
      } else {
        navigate(`/search`);
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-pattern">
        <Hero3D />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {t('hero.subtitle')}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-gradient">{t('hero.title')}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {t('hero.description')}
            </motion.p>

            {/* Quick Search */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleQuickSearch}
              className="max-w-xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input ps-12 pe-4 h-14 text-base"
                />
              </div>
            </motion.form>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 gap-2 text-base"
              >
                <Link to="/search">
                  <Search className="w-5 h-5" />
                  {t('hero.exploreButton')}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 px-8 gap-2 text-base"
              >
                <Link to="/on-this-day">
                  <Calendar className="w-5 h-5" />
                  {t('hero.onThisDayButton')}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-2.5 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              {t('search.category')}
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {categories.slice(0, 8).map((category) => (
              <motion.div key={category} variants={itemVariants}>
                <Link
                  to={`/results?category=${category}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium"
                >
                  {t(`category.${category}`)}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
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
            <Button variant="outline" asChild className="hidden sm:flex gap-2">
              <Link to="/search">
                {t('common.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* On This Day Preview */}
      {todayEvents.length > 0 && (
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
                    date: new Date().toLocaleDateString(),
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
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
                {t('nav.articles')}
              </h2>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex gap-2">
              <Link to="/articles">
                {t('common.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
