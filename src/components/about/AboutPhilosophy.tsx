import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function AboutPhilosophy() {
    return (
        <section className="py-24 bg-muted/10">
            <div className="container mx-auto px-4 max-w-3xl text-start">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <div className="flex items-center gap-4 text-primary">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <h2 className="font-display text-3xl font-bold tracking-tight">فلسفة المنتج</h2>
                    </div>

                    <div className="prose prose-xl dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-serif">
                        <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:float-start first-letter:me-4 first-letter:mt-2 first-letter:leading-none">
                            نحن نؤمن في EraTracker أن التصميم ليس مجرد "شكل"، بل هو وسيرة لنقل الحقيقة بوضوح. التاريخ والعلوم موضوعات عميقة بطبعها، ولا تستحق أن تُعرض في قوالب جامدة أو مملة.
                        </p>
                        <p>
                            لهذا السبب، نقوم ببناء كل جزء في المنصة ببطء وعناية. نحن نختار الخطوط التي لا ترهق العين، والمساحات البيضاء التي تمنح الفكر فرصة للتأمل، والألوان التي تعكس هيبة الماضي وطموح المستقبل.
                        </p>
                        <p>
                            كل بكسل في هذه المنصة وُضع لغرض واحد: أن نجعلك تشعر بجمال المعرفة. نحن هنا لنصنع مكاناً يليق بعقل القارئ العربي ويقدم له تجربة عالمية المستوى، بعيداً عن ضجيج الإعلانات أو المحتوى السريع قليل الفائدة.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
