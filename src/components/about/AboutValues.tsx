import { motion } from 'framer-motion';
import { ShieldCheck, Layers, Eye, BookOpen } from 'lucide-react';

const values = [
    {
        title: 'محتوى موثوق ومراجع',
        description: 'نعتمد في EraTracker على مصادر تاريخية موثقة ومراجعة بدقة لضمان تقديم المعلومة الصحيحة في سياقها التاريخي السليم.',
        icon: ShieldCheck,
        color: 'text-primary',
        bg: 'bg-primary/10'
    },
    {
        title: 'ربط الأحداث عبر العصور',
        description: 'نتميز بقدرتنا على ربط الخيوط بين الأحداث السياسية، الاكتشافات العلمية، والتحولات الثقافية لنقدم صورة كاملة للتاريخ.',
        icon: Layers,
        color: 'text-accent',
        bg: 'bg-accent/10'
    },
    {
        title: 'تجربة قراءة ذكية',
        description: 'صممنا المنصة لتكون رحلة ممتعة بصرياً، مع واجهة مستخدم تحترم تركيزك وتقدم المعلومات بأسلوب تحريري راقٍ.',
        icon: Eye,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        title: 'احترام المصدر المفتوح',
        description: 'نؤمن بأهمية مشاع المعرفة، لذا نحترم ونوثق مساهمات Wikipedia وغيرها من المنصات مع توضيح الفروق بين المحتوى.',
        icon: BookOpen,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
    }
];

export function AboutValues() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold mb-4 tracking-tight">ما الذي يميز EraTracker؟</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        نحن لا نجمع البيانات فحسب، بل نصمم تجربة معرفية متكاملة تقوم على أربعة أعمدة أساسية.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 group shadow-sm hover:shadow-xl"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${v.bg} ${v.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <v.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-display text-xl font-bold mb-3 text-start">{v.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-start text-sm">
                                {v.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
