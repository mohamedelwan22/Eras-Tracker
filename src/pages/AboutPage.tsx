import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Helmet } from 'react-helmet-async';
import { buildTitle, buildDescription, buildCanonicalUrl } from '@/utils/seo';

// New Components
import { AboutHero } from '@/components/about/AboutHero';
import { AboutMission } from '@/components/about/AboutMission';
import { AboutValues } from '@/components/about/AboutValues';
import { AboutTrust } from '@/components/about/AboutTrust';
import { AboutPhilosophy } from '@/components/about/AboutPhilosophy';
import { AboutCTA } from '@/components/about/AboutCTA';

export default function AboutPage() {
  const { t } = useApp();

  const title = buildTitle(t('nav.about'));
  const description = buildDescription("تعرف على EraTracker، المنصة المعرفية المخصصة لاستكشاف أحداث التاريخ والعلوم بأسلوب تحريري راقٍ وتجربة قراءة غامرة.");

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={buildCanonicalUrl('/about')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col">
        <AboutHero />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <AboutMission />
          <AboutValues />
          <AboutTrust />
          <AboutPhilosophy />
          <AboutCTA />
        </motion.div>
      </div>
    </Layout>
  );
}
