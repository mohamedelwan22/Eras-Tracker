import { motion } from 'framer-motion';

interface LegalHeaderProps {
    title: string;
    subtitle?: string;
    updatedAt?: string;
}

export function LegalHeader({ title, subtitle, updatedAt }: LegalHeaderProps) {
    return (
        <section className="relative pt-32 pb-16 overflow-hidden bg-background">
            {/* Decorative background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        <span className="text-gradient">{title}</span>
                    </h1>

                    {subtitle && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    {updatedAt && (
                        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground font-medium">
                            آخر تحديث: {updatedAt}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
