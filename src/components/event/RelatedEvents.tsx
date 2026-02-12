import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Event } from '@/lib/types';
import { searchEvents } from '@/config/api';
import { RelatedEventCard } from './RelatedEventCard';
import { Loader2 } from 'lucide-react';

interface RelatedEventsProps {
    currentEvent: Event;
}

export function RelatedEvents({ currentEvent }: RelatedEventsProps) {
    const { t } = useApp();
    const [related, setRelated] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            try {
                // 1. Fetch events in same category
                const response = await searchEvents({
                    category: currentEvent.category,
                    limit: 15
                });

                if (response.success) {
                    let pool = response.data.events;

                    // 2. Filter out current event and Wikipedia events
                    pool = pool.filter(e => e.id !== currentEvent.id && !String(e.id).startsWith('wiki-'));

                    // 3. Scoring logic
                    const scored = pool.map(e => {
                        let score = 0;

                        // Priority: Same category (already in pool, but good for future-proofing)
                        if (e.category === currentEvent.category) score += 10;

                        // Priority: Same era
                        if (e.date.era === currentEvent.date.era) score += 5;

                        // Priority: Shared tags
                        const sharedTags = e.tags.filter(tag => currentEvent.tags.includes(tag));
                        score += sharedTags.length * 3;

                        // Priority: Proximity in time (± 50 years)
                        const yearDiff = Math.abs(e.date.year - currentEvent.date.year);
                        if (yearDiff <= 50) score += 2;

                        return { event: e, score };
                    });

                    // 4. Sort by score descending
                    const sorted = scored.sort((a, b) => b.score - a.score).map(s => s.event);

                    // 5. Select top 3-6
                    setRelated(sorted.slice(0, 6));
                }
            } catch (error) {
                console.error('Failed to fetch related events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentEvent.id]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-20 border-t border-border/30">
                <h3 className="font-display text-3xl font-bold mb-10 text-start">
                    {t('locale') === 'ar' ? 'أحداث ذات صلة' : 'Related Events'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[16/10] bg-muted animate-pulse rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (related.length === 0) return null;

    return (
        <div className="max-w-4xl mx-auto py-20 border-t border-border/30">
            <h3 className="font-display text-3xl font-bold mb-10 text-start">
                {t('locale') === 'ar' ? 'أحداث ذات صلة' : 'Related Events'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {related.map((event) => (
                    <RelatedEventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
