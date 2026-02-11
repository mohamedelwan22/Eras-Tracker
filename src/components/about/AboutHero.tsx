import { motion } from 'framer-motion';

export function AboutHero() {
    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-background">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
                    >
                        في عالم يمتلئ بالمعلومات المتناثرة، نسعى في EraTracker إلى تقديم سياق تاريخي وعلمي متصل. نحن لا نقدم مجرد تواريخ، بل نبحث عن "السبب" الذي جعل حدثاً واحداً يغير مجرى البشرية.
                    </motion.span>

                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                        نحن لا نعرض التاريخ… <br />
                        <span className="text-gradient">نحن نعيد روايته</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        منصة معرفية مخصصة لاستكشاف الروابط الخفية بين أحداث التاريخ واكتشافات العلم، مصممة لتجربة قراءة غامرة تحترم عقلك وفضولك.
                    </p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent opacity-30" />
            </motion.div>
        </section>
    );
}
