import { motion } from 'framer-motion';
import { Target, Compass } from 'lucide-react';

export function AboutMission() {
    return (
        <section className="py-24 bg-background border-y border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-start"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="font-display text-4xl font-bold tracking-tight">مهمتنا</h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                في عالم يمتلئ بالمعلومات المتناثرة، نسعى في EraTracker إلى تقديم سياق تاريخي وعلمي متصل. نحن لا نقدم مجرد تواريخ، بل نبحث عن "السبب" الذي جعل حدثاً واحداً يغير مجرى البشرية.
                            </p>
                            <p>
                                مهمتنا هي تمكين الباحثين، الطلاب، وعشاق المعرفة من الوصول إلى محتوى تاريخي موثق يتم رويّه بأسلوب قصصي حديث يجمع بين دقة الأرشيف وجمال العرض البصري.
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-start"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                            <Compass className="w-6 h-6" />
                        </div>
                        <h2 className="font-display text-4xl font-bold tracking-tight">رؤيتنا</h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                نطمح إلى أن نكون المرجع العالمي الأول والأكثر موثوقية في ربط أحداث التاريخ واكتشافات العلم عبر العصور، من خلال بناء منصة ذكية تتجاوز حدود القراءة التقليدية لتصبح تجربة تفاعلية تستشرف المستقبل من خلال دروس الماضي.
                            </p>
                            <p>
                                رؤيتنا تتجاوز عرض البيانات؛ نحن نبني جسراً معرفياً يربط الأجيال بإرثها البشري الجماعي في إطار من الشفافية العلمية والتطور التقني.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
