/**
 * Safely removes all HTML tags from a string.
 * This is useful for cleaning data coming from external APIs like Wikipedia
 * that might contain formatting tags in titles or descriptions.
 * 
 * @param html - The string containing potential HTML tags
 * @returns Cleaned plain text
 */
export function stripHtml(html: string): string {
    if (!html) return '';

    // Use Regex to remove all tags
    // This matches everything between < and >
    return html
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')    // Replace non-breaking spaces
        .replace(/&amp;/g, '&')     // Replace ampersands
        .replace(/&lt;/g, '<')      // Replace less-than symbols
        .replace(/&gt;/g, '>')      // Replace greater-than symbols
        .replace(/&quot;/g, '"')    // Replace double quotes
        .replace(/&#39;/g, "'")     // Replace single quotes
        .trim();
}
