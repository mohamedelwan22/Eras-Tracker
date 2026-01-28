import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const { t } = useApp();

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-center mb-8">{t('contact.title')}</h1>
            
            <form className="space-y-6 bg-card rounded-2xl border border-border p-8">
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                <Input placeholder={t('contact.name')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
                <Input type="email" placeholder={t('contact.email')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                <Textarea rows={5} placeholder={t('contact.message')} />
              </div>
              <Button type="submit" className="w-full">{t('contact.send')}</Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
