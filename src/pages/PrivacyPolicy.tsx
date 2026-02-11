import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Globe, Database, Cookie } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Helmet } from 'react-helmet-async';
import { buildTitle, buildDescription, buildCanonicalUrl } from '@/utils/seo';
import { LegalHeader } from '@/components/legal/LegalHeader';
import { LegalSection } from '@/components/legal/LegalSection';

export default function PrivacyPolicy() {
    const { locale } = useApp();

    const title = buildTitle("سياسة الخصوصية");
    const description = buildDescription("تعرف على كيفية حماية EraTracker لخصوصيتك. نحن نلتزم بالشفافية المطلقة ولا نجمع بياناتك الشخصية لأغراض ترويجية.");

    return (
        <Layout>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={buildCanonicalUrl('/privacy')} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
            </Helmet>

            <LegalHeader
                title="سياسة الخصوصية"
                subtitle="في EraTracker، نؤمن بأن خصوصيتك جزء لا يتجزأ من جودة المحتوى الذي نقدمه. التزامنا بحماية بياناتك هو التزام أخلاقي قبل أن يكون قانونياً."
                updatedAt="5 فبراير 2026"
            />

            <div className="container mx-auto px-4 pb-24 max-w-4xl">
                <LegalSection title="مقدمة" icon={<Shield className="w-8 h-8" />}>
                    <p>
                        EraTracker هي منصة تهدف لنشر التاريخ والعلوم بأسلوب تعليمي وتثقيفي. نحن ندرك أهمية الخصوصية لمستخدمينا، ولدينا نهج بسيط وواضح تماماً: نحن لا نجمع أي بيانات لا نحتاجها لتقديم الخدمة.
                    </p>
                    <p>
                        توضح هذه الصفحة بشفافية نوع البيانات التي نتعامل معها، وكيف نضمن حمايتها، وفلسفتنا تجاه تداول المعلومات الرقمية.
                    </p>
                </LegalSection>

                <LegalSection title="البيانات التي نجمعها" icon={<Database className="w-8 h-8" />}>
                    <p>
                        يسعدنا إعلامك أن EraTracker مصممة لتكون "مجهولة الهوية" قدر الإمكان.
                    </p>
                    <ul className="list-disc ps-6 space-y-3 mt-4 text-start">
                        <li><strong>لا توجد حسابات:</strong> لا نطلب منك إنشاء حساب أو تقديم بريدك الإلكتروني لتصفح المنصة.</li>
                        <li><strong>لا توجد بيانات حساسة:</strong> نحن لا نجمع الأسماء، العناوين، أو أي معلومات تعريفية شخصية.</li>
                        <li><strong>بيانات فنية محدودة:</strong> قد نجمع معلومات تقنية عامة (مثل نوع المتصفح، اللغة، وسنة التاريخ التي تبحث عنها) لغرض تحسين الأداء وتعزيز محرك البحث الداخلي فقط.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="كيف نستخدم بياناتك؟" icon={<Eye className="w-8 h-8" />}>
                    <p>
                        استخدامنا للبيانات الفنية يقتصر حصراً على:
                    </p>
                    <ul className="list-disc ps-6 space-y-3 mt-4 text-start">
                        <li>تحسين تجربة القراءة وتسهيل التنقل بين العصور.</li>
                        <li>تحليل الأداء الفني للمنصة لضمان سرعة التحميل.</li>
                        <li><strong>مبدأنا الأساسي:</strong> لا نقوم ببيع بياناتك لأي طرف ثالث، ولا نستخدمها لأغراض تتبع الإعلانات.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="ملفات تعريف الارتباط (Cookies)" icon={<Cookie className="w-8 h-8" />}>
                    <p>
                        نحن نستخدم ملفات تعريف الارتباط فقط عندما تكون ضرورية تقنياً (مثل حفظ لغة التصفح المفضلة لديك). هذه الملفات لا تستخدم لأي غرض تتبع سلوكي خارج حدود المنصة.
                    </p>
                </LegalSection>

                <LegalSection title="الروابط الخارجية والمراجع" icon={<Globe className="w-8 h-8" />}>
                    <p>
                        تتضمن منصتنا روابط لمصادر خارجية (مثل ويكيبيديا ومواقع الأبحاث). يرجى ملاحظة:
                    </p>
                    <p className="border-l-4 border-accent ps-6 my-6 italic text-start">
                        "نحن غير مسؤولين عن سياسات الخصوصية أو المحتوى الموجود في المواقع الخارجية. ننصح دائماً بمراجعة سياسات تلك المواقع عند زيارتها."
                    </p>
                </LegalSection>

                <div className="mt-20 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10 text-center">
                    <Lock className="w-10 h-10 text-primary mx-auto mb-6 opacity-50" />
                    <h3 className="font-bold text-xl mb-4">تحديثات السياسة</h3>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                        قد نقوم بتحديث سياسة الخصوصية هذه من حين لآخر لتعكس التغييرات في قوانين الخصوصية العالمية أو ميزات المنصة الجديدة. سيتم نشر أي تغييرات هنا فوراً، وسنحافظ دائماً على نفس الالتزام الصارم بخصوصيتك.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
