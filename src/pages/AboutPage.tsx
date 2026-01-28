import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';

export default function AboutPage() {
  const { t } = useApp();

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">{t('about.title')}</h1>
            <p className="text-lg text-muted-foreground mb-12">{t('about.missionText')}</p>
            
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="font-display text-2xl font-semibold mb-4">{t('about.mission')}</h2>
              <p className="text-muted-foreground">{t('footer.description')}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
