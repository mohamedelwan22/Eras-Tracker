import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function AboutCTA() {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center space-y-10"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                        ابدأ رحلتك عبر الزمن الآن
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        استكشف آلاف الأحداث والمحطات التاريخية والعلمية التي شكلت عالمنا اليوم.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <Button size="lg" asChild className="h-14 px-10 rounded-2xl text-lg gap-3 shadow-xl shadow-primary/20 group">
                            <Link to="/results?year=2024">
                                استكشف الأحداث
                                <ArrowLeft className="w-5 h-5 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </Button>

                        <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-2xl text-lg hover:bg-muted/50 transition-colors">
                            <Link to="/">العودة للرئيسية</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
