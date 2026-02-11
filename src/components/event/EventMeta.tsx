import { Calendar, MapPin, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface EventMetaProps {
    year: number;
    era: 'BCE' | 'CE';
    category: string;
    importance: string;
    country?: string;
}

export function EventMeta({ year, era, category, importance, country }: EventMetaProps) {
    const { t } = useApp();

    const importanceStyles = {
        critical: 'bg-red-500/10 text-red-500 border-red-500/20',
        high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };

    return (
        <div className="flex flex-wrap items-center gap-6 py-8 border-b border-border/50 text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg text-foreground">
                    {Math.abs(year)} {era}
                </span>
            </div>

            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            <div className="flex items-center gap-2">
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-widest">
                    {t(`category.${category}`)}
                </span>
            </div>

            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-tighter",
                importanceStyles[importance as keyof typeof importanceStyles] || importanceStyles.medium
            )}>
                <ShieldAlert className="w-3 h-3" />
                {importance}
            </div>

            {country && (
                <>
                    <div className="h-4 w-px bg-border/50 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-medium">{country}</span>
                    </div>
                </>
            )}
        </div>
    );
}
