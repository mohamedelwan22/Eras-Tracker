interface EventContentProps {
    content: string;
}

export function EventContent({ content }: EventContentProps) {
    return (
        <div className="max-w-3xl mx-auto py-16">
            <div className="prose prose-xl dark:prose-invert max-w-none text-start text-foreground/90 leading-[1.8] font-serif">
                <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:float-start first-letter:me-4 first-letter:mt-2 first-letter:leading-none whitespace-pre-line">
                    {content}
                </p>
            </div>
        </div>
    );
}
