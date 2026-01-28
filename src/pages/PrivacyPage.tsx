import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';

export default function PrivacyPage() {
  const { t } = useApp();

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-center mb-12">{t('privacy.title')}</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground">
                Your privacy is important to us. This privacy policy explains how ErasTracker collects, uses, and protects your information.
              </p>
              <h2 className="font-display text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly, such as contact form submissions, and automatically collected data like usage statistics.
              </p>
              <h2 className="font-display text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use your information to improve our services and provide you with a better experience exploring historical events.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
