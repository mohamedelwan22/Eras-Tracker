import { stripHtml } from './stripHtml';

const BASE_URL = window.location.origin;
const DEFAULT_TITLE = 'EraTracker | اكتشف أحداث التاريخ والعلم عبر العصور';
const DEFAULT_DESCRIPTION = 'Eratracker هي منصة تفاعلية لاستكشاف أحداث التاريخ والعلوم عبر العصور، من العصور القديمة إلى العصر الحديث.';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const buildTitle = (pageTitle?: string) => {
    if (!pageTitle) return DEFAULT_TITLE;
    return `${pageTitle} | EraTracker`;
};

export const buildDescription = (description?: string) => {
    if (!description) return DEFAULT_DESCRIPTION;
    const cleaned = stripHtml(description);
    return cleaned.length > 155 ? `${cleaned.substring(0, 155)}...` : cleaned;
};

export const buildCanonicalUrl = (path: string) => {
    return `${BASE_URL}${path}`;
};

export const buildOgImage = (imageUrl?: string) => {
    return imageUrl || DEFAULT_OG_IMAGE;
};
