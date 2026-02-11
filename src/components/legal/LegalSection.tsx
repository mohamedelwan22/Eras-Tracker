import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface LegalSectionProps {
    title?: string;
    children: ReactNode;
    icon?: ReactNode;
}

export function LegalSection({ title, children, icon }: LegalSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-start"
        >
            {title && (
                <div className="flex items-center gap-3 mb-6">
                    {icon && <div className="text-primary">{icon}</div>}
                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                        {title}
                    </h2>
                </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-serif">
                {children}
            </div>
        </motion.div>
    );
}
