import { Tag } from 'lucide-react';

interface EventTagsProps {
    tags: string[];
}

export function EventTags({ tags }: EventTagsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="max-w-3xl mx-auto py-12">
            <div className="flex flex-wrap gap-2">
                <div className="w-full mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-xs font-bold">
                    <Tag className="w-3 h-3" />
                    Tags
                </div>
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all cursor-default"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
