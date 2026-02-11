import { motion } from 'framer-motion';
import { Mail, MessageSquare, Handshake, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { buildTitle, buildDescription, buildCanonicalUrl } from '@/utils/seo';
import { LegalHeader } from '@/components/legal/LegalHeader';
import { LegalSection } from '@/components/legal/LegalSection';

export default function ContactPage() {
  const { t } = useApp();

  const title = buildTitle("تواصل معنا");
  const description = buildDescription("تواصل مع فريق EraTracker لمشاركة آرائك، مقترحاتك، أو للإبلاغ عن أي تصحيحات محتملة في المحتوى.");

  const contactMethods = [
    {
      title: 'البريد الإلكتروني',
      value: 'Support@eratracker.com',
      icon: Mail,
      desc: 'للمراسلات العامة والاستفسارات التقنية.'
    },
    {
      title: 'تصحيح المحتوى',
      value: 'Support@eratracker.com',
      icon: MessageSquare,
      desc: 'إذا وجدت أي معلومة غير دقيقة، نرجو إبلاغنا فوراً.'
    },
    {
      title: 'الشراكات والمعلومات',
      value: 'Support@eratracker.com',
      icon: Handshake,
      desc: 'للتعاون التعليمي والبحثي مع المؤسسات.'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={buildCanonicalUrl('/contact')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Helmet>

      <LegalHeader
        title="تواصل معنا"
        subtitle="نحن نؤمن بأن المعرفة رحلة تشاركية. سواء كان لديك اقتراح، نقد، أو فكرة لتعاون جديد، يسعدنا دائماً الاستماع إليك."
      />

      <div className="container mx-auto px-4 pb-24 max-w-4xl">
        <LegalSection title="لماذا نتواصل؟">
          <p>
            في EraTracker، نعتبر كل قارئ شريكاً في صياغة التاريخ وتوثيقه. نحن نسعى جاهدين لتحقيق أعلى درجات الدقة، ولكننا ندرك أن الكمال رحلة مستمرة.
          </p>
          <p>
            تواصل معنا للمساهمة في:
          </p>
          <ul className="list-disc ps-6 space-y-2 mt-4 text-start">
            <li><strong>استقبال الملاحظات:</strong> مشاركة رأيك في تجربة القراءة والبحث.</li>
            <li><strong>تصحيح المعلومات:</strong> الإبلاغ عن أي خطأ تاريخي أو علمي محتمل.</li>
            <li><strong>التعاون المعرفي:</strong> إذا كان لديك شغف بالبحث وتود المساهمة في إثراء المنصة.</li>
            <li><strong>اقتراح محتوى جديد:</strong> هل هناك حقبة أو حدث تعتقد أنه يستحق التسليط عليه؟</li>
          </ul>
        </LegalSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group text-start shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <method.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">{method.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {method.desc}
              </p>
              <div className="text-sm font-medium text-primary break-all">
                {method.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-muted/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 border border-border/30 mb-20"
        >
          <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary/60 border border-border/50">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-start">
            <strong>ملاحظة حول الخصوصية:</strong> نحن نحترم خصوصيتك تماماً. البيانات التي تشاركها معنا تُستخدم فقط للرد على استفساراتك، ولن يتم بيعها أو استخدامها لأي أغراض تسويقية غير مرغوب فيها.
          </p>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild className="h-14 px-10 rounded-2xl text-lg gap-3 shadow-xl shadow-primary/20 group">
            <Link to="/search">
              استكشف الأحداث
              <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
