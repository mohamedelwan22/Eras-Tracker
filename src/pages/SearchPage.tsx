import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { SearchForm } from '@/components/SearchForm';

export default function SearchPage() {
  const { t } = useApp();

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                {t('search.title')}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('hero.description')}
              </p>
            </div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6 sm:p-8"
            >
              <SearchForm />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
