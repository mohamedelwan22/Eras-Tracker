import { ExternalLink, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Source {
    title: string;
    url?: string;
}

interface EventSourcesProps {
    sources: Source[];
}

export function EventSources({ sources }: EventSourcesProps) {
    const { t } = useApp();

    if (!sources || sources.length === 0) return null;

    return (
        <div className="max-w-3xl mx-auto py-12 border-t border-border/50">
            <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                {t('event.sources')}
            </h3>
            <ul className="space-y-4">
                {sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                        <ExternalLink className="w-4 h-4 mt-1.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="text-start">
                            {source.url ? (
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-medium text-foreground hover:text-primary transition-colors hover:underline"
                                >
                                    {source.title}
                                </a>
                            ) : (
                                <span className="text-lg font-medium text-foreground">{source.title}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-8 italic text-start">
                {t('locale') === 'ar' ? 'المصادر لأغراض التوثيق فقط' : 'Sources are for documentation purposes only.'}
            </p>
        </div>
    );
}
