import { motion } from 'framer-motion';
import { Info, Lock, Globe } from 'lucide-react';

export function AboutTrust() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-primary/5 rounded-[3rem] p-10 md:p-16 border border-primary/10 relative overflow-hidden"
                >
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-primary mb-8 justify-center">
                            <Lock className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">ميثاق الثقة والمصادر</span>
                        </div>

                        <h2 className="font-display text-4xl font-bold mb-10 text-center tracking-tight">كيف نتعامل مع المحتوى؟</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2 text-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">1</span>
                                    </div>
                                    <h3 className="font-bold text-xl">المحتوى الداخلي</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-start">
                                    يتم إعداد المحتوى الخاص بـ EraTracker بعناية فائقة، حيث نعتمد على مراجع تاريخية موثقة ونقوم بتدقيق كل واقعة قبل نشرها لضمان أعلى درجات الدقة والنزاهة العلمية.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2 text-start">
                                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                        <span className="text-accent font-bold text-sm">2</span>
                                    </div>
                                    <h3 className="font-bold text-xl">تكامل ويكيبيديا</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-start">
                                    نوفر خاصية معاينة أحداث ويكيبيديا كمصدر إضافي مكمل. نحرص دائماً على توضيح مصدر المعلومة وننسب الفضل لمجتمع ويكيبيديا، مع الحفاظ على فصل تام بين بياناتنا الخاصة والمحتوى الخارجي.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-primary/10 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4 text-primary/70">
                                <Globe className="w-6 h-6" />
                                <span className="font-medium">نحترم المشاع الإبداعي وحقوق النشر الدولية</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xl text-center">
                                مهمتنا هي تنظيم المعرفة البشرية وليس احتكارها. نلتزم بمعايير التوثيق الأكاديمي ونوفر روابط المصادر الأصلية لكل حدث ننشره.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
