import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Hero3D } from '@/components/Hero3D';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getArticles } from '@/config/api';
import { Article } from '@/lib/types';
import { categories } from '@/lib/mocks';
import { Helmet } from 'react-helmet-async';
import { buildTitle, buildDescription, buildCanonicalUrl, buildOgImage } from '@/utils/seo';

// Import new integrated components
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { RandomEvents } from '@/components/home/RandomEvents';
import { OnThisDay } from '@/components/home/OnThisDay';

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
  const { t } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await getArticles(1, 3);
        if (response.success) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoadingArticles(false);
      }
    };

    loadArticles();
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
      <Helmet>
        <title>{buildTitle()}</title>
        <meta name="description" content={buildDescription()} />
        <link rel="canonical" href={buildCanonicalUrl('/')} />
        <meta property="og:title" content={buildTitle()} />
        <meta property="og:description" content={buildDescription()} />
        <meta property="og:image" content={buildOgImage()} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
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

      {/* 1. Featured Events Section */}
      <FeaturedEvents />

      {/* 2. Random Events Section */}
      <RandomEvents />

      {/* 3. On This Day Section */}
      <OnThisDay />

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

          {loadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
