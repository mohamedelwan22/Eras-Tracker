import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Register the language - handle potential module loading issues
if (countries && typeof countries.registerLocale === 'function') {
    countries.registerLocale(enLocale);
}

export interface CountryOption {
    code: string;
    name: string;
}

/**
 * Returns a complete list of ISO-3166 countries
 * Sorted alphabetically by country name
 */
export const getCountries = (): CountryOption[] => {
    try {
        if (!countries || typeof countries.getNames !== 'function') {
            return [];
        }

        const countryObj = countries.getNames('en', { select: 'official' });

        return Object.entries(countryObj)
            .map(([code, name]) => ({
                code,
                name: Array.isArray(name) ? name[0] : name, // Handle potential array response
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};
