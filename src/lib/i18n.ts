import { Locale, LocaleConfig, Direction } from './types';

export const locales: LocaleConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
];

export const defaultLocale: Locale = 'en';

export const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.search': 'بحث',
    'nav.onThisDay': 'في مثل هذا اليوم',
    'nav.articles': 'مقالات',
    'nav.about': 'من نحن',
    'nav.privacy': 'سياسة الخصوصية',
    'nav.contact': 'اتصل بنا',

    // Hero
    'hero.title': 'EraTracker',
    'hero.subtitle': 'تتبع التاريخ والعلوم عبر الزمن',
    'hero.description': 'اكتشف الأحداث التاريخية والعلمية المهمة من جميع أنحاء العالم. رحلة عبر الزمن لفهم كيف شكّل الماضي حاضرنا.',
    'hero.searchPlaceholder': 'ابحث عن أحداث تاريخية...',
    'hero.exploreButton': 'استكشف الأحداث',
    'hero.onThisDayButton': 'في مثل هذا اليوم',

    // Search
    'search.title': 'بحث متقدم',
    'search.year': 'السنة',
    'search.yearPlaceholder': 'أدخل السنة (مثال: 1969)',
    'search.month': 'الشهر',
    'search.monthPlaceholder': 'اختر الشهر',
    'search.day': 'اليوم',
    'search.dayPlaceholder': 'اختر اليوم',
    'search.category': 'الفئة',
    'search.categoryPlaceholder': 'اختر الفئة',
    'search.country': 'الدولة',
    'search.countryPlaceholder': 'اختر الدولة',
    'search.submit': 'بحث',
    'search.random': 'بحث عشوائي',
    'search.required': 'هذا الحقل مطلوب',
    'search.invalidYear': 'السنة غير صالحة',

    // Results
    'results.title': 'نتائج البحث',
    'results.found': 'تم العثور على {count} نتيجة',
    'results.noResults': 'لم يتم العثور على نتائج',
    'results.noResultsSuggestion': 'جرب تغيير معايير البحث أو استخدم البحث العشوائي',
    'results.sortBy': 'ترتيب حسب',
    'results.sortByDate': 'التاريخ',
    'results.sortByImportance': 'الأهمية',
    'results.loadMore': 'تحميل المزيد',

    // Event
    'event.sources': 'المصادر',
    'event.relatedEvents': 'أحداث ذات صلة',
    'event.share': 'مشاركة',
    'event.backToResults': 'العودة للنتائج',
    'event.readFullOnWikipedia': 'اقرأ المقال كاملًا على ويكيبيديا',
    'event.externalDisclaimer': '* سيتم نقلك إلى موقع ويكيبيديا لقراءة القصة الكاملة.',

    // On This Day
    'onThisDay.title': 'في مثل هذا اليوم',
    'onThisDay.subtitle': 'اكتشف ما حدث في {date}',
    'onThisDay.selectDate': 'اختر تاريخاً',

    // Articles
    'articles.title': 'مقالات',
    'articles.readMore': 'اقرأ المزيد',
    'articles.readingTime': '{minutes} دقائق للقراءة',
    'articles.by': 'بقلم',

    // Categories
    'category.science': 'علوم',
    'category.politics': 'سياسة',
    'category.war': 'حروب',
    'category.culture': 'ثقافة',
    'category.discovery': 'اكتشافات',
    'category.invention': 'اختراعات',
    'category.natural_disaster': 'كوارث طبيعية',
    'category.medicine': 'طب',
    'category.space': 'فضاء',
    'category.religion': 'دين',
    'category.economics': 'اقتصاد',
    'category.sports': 'رياضة',
    'category.art': 'فن',
    'category.literature': 'أدب',

    // Months
    'month.1': 'يناير',
    'month.2': 'فبراير',
    'month.3': 'مارس',
    'month.4': 'أبريل',
    'month.5': 'مايو',
    'month.6': 'يونيو',
    'month.7': 'يوليو',
    'month.8': 'أغسطس',
    'month.9': 'سبتمبر',
    'month.10': 'أكتوبر',
    'month.11': 'نوفمبر',
    'month.12': 'ديسمبر',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.retry': 'إعادة المحاولة',
    'common.viewAll': 'عرض الكل',
    'common.learnMore': 'اعرف المزيد',

    // Theme
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.description': 'منصة لاستكشاف التاريخ والعلوم عبر الزمن',

    // About
    'about.title': 'من نحن',
    'about.mission': 'مهمتنا',
    'about.missionText': 'نهدف إلى جعل التاريخ والعلوم في متناول الجميع من خلال منصة تفاعلية سهلة الاستخدام.',

    // Contact
    'contact.title': 'اتصل بنا',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال',

    // Privacy
    'privacy.title': 'سياسة الخصوصية',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.onThisDay': 'On This Day',
    'nav.articles': 'Articles',
    'nav.about': 'About',
    'nav.privacy': 'Privacy Policy',
    'nav.contact': 'Contact',

    // Hero
    'hero.title': 'EraTracker',
    'hero.subtitle': 'Track history and science across time',
    'hero.description': 'Discover important historical and scientific events from around the world. A journey through time to understand how the past shaped our present.',
    'hero.searchPlaceholder': 'Search for historical events...',
    'hero.exploreButton': 'Explore Events',
    'hero.onThisDayButton': 'On This Day',

    // Search
    'search.title': 'Advanced Search',
    'search.year': 'Year',
    'search.yearPlaceholder': 'Enter year (e.g., 1969)',
    'search.month': 'Month',
    'search.monthPlaceholder': 'Select month',
    'search.day': 'Day',
    'search.dayPlaceholder': 'Select day',
    'search.category': 'Category',
    'search.categoryPlaceholder': 'Select category',
    'search.country': 'Country',
    'search.countryPlaceholder': 'Select country',
    'search.submit': 'Search',
    'search.random': 'Random Search',
    'search.required': 'This field is required',
    'search.invalidYear': 'Invalid year',

    // Results
    'results.title': 'Search Results',
    'results.found': 'Found {count} results',
    'results.noResults': 'No results found',
    'results.noResultsSuggestion': 'Try changing your search criteria or use random search',
    'results.sortBy': 'Sort by',
    'results.sortByDate': 'Date',
    'results.sortByImportance': 'Importance',
    'results.loadMore': 'Load More',

    // Event
    'event.sources': 'Sources',
    'event.relatedEvents': 'Related Events',
    'event.share': 'Share',
    'event.backToResults': 'Back to Results',
    'event.readFullOnWikipedia': 'Read full article on Wikipedia',
    'event.externalDisclaimer': '* You will be redirected to Wikipedia to read the full story.',

    // On This Day
    'onThisDay.title': 'On This Day',
    'onThisDay.subtitle': 'Discover what happened on {date}',
    'onThisDay.selectDate': 'Select a date',

    // Articles
    'articles.title': 'Articles',
    'articles.readMore': 'Read More',
    'articles.readingTime': '{minutes} min read',
    'articles.by': 'By',

    // Categories
    'category.science': 'Science',
    'category.politics': 'Politics',
    'category.war': 'War',
    'category.culture': 'Culture',
    'category.discovery': 'Discovery',
    'category.invention': 'Invention',
    'category.natural_disaster': 'Natural Disaster',
    'category.medicine': 'Medicine',
    'category.space': 'Space',
    'category.religion': 'Religion',
    'category.economics': 'Economics',
    'category.sports': 'Sports',
    'category.art': 'Art',
    'category.literature': 'Literature',

    // Months
    'month.1': 'January',
    'month.2': 'February',
    'month.3': 'March',
    'month.4': 'April',
    'month.5': 'May',
    'month.6': 'June',
    'month.7': 'July',
    'month.8': 'August',
    'month.9': 'September',
    'month.10': 'October',
    'month.11': 'November',
    'month.12': 'December',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.viewAll': 'View All',
    'common.learnMore': 'Learn More',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    // Footer
    'footer.rights': 'All rights reserved',
    'footer.description': 'A platform to explore history and science through time',

    // About
    'about.title': 'About Us',
    'about.mission': 'Our Mission',
    'about.missionText': 'We aim to make history and science accessible to everyone through an interactive, easy-to-use platform.',

    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',

    // Privacy
    'privacy.title': 'Privacy Policy',
  },

  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.search': 'Recherche',
    'nav.onThisDay': 'Ce Jour-là',
    'nav.articles': 'Articles',
    'nav.about': 'À Propos',
    'nav.privacy': 'Politique de Confidentialité',
    'nav.contact': 'Contact',

    // Hero
    'hero.title': 'EraTracker',
    'hero.subtitle': "Suivez l'histoire et la science à travers le temps",
    'hero.description': "Découvrez les événements historiques et scientifiques importants du monde entier. Un voyage dans le temps pour comprendre comment le passé a façonné notre présent.",
    'hero.searchPlaceholder': 'Rechercher des événements historiques...',
    'hero.exploreButton': 'Explorer les Événements',
    'hero.onThisDayButton': 'Ce Jour-là',

    // Search
    'search.title': 'Recherche Avancée',
    'search.year': 'Année',
    'search.yearPlaceholder': "Entrer l'année (ex: 1969)",
    'search.month': 'Mois',
    'search.monthPlaceholder': 'Sélectionner le mois',
    'search.day': 'Jour',
    'search.dayPlaceholder': 'Sélectionner le jour',
    'search.category': 'Catégorie',
    'search.categoryPlaceholder': 'Sélectionner la catégorie',
    'search.country': 'Pays',
    'search.countryPlaceholder': 'Sélectionner le pays',
    'search.submit': 'Rechercher',
    'search.random': 'Recherche Aléatoire',
    'search.required': 'Ce champ est obligatoire',
    'search.invalidYear': 'Année invalide',

    // Results
    'results.title': 'Résultats de Recherche',
    'results.found': '{count} résultats trouvés',
    'results.noResults': 'Aucun résultat trouvé',
    'results.noResultsSuggestion': 'Essayez de modifier vos critères de recherche ou utilisez la recherche aléatoire',
    'results.sortBy': 'Trier par',
    'results.sortByDate': 'Date',
    'results.sortByImportance': 'Importance',
    'results.loadMore': 'Charger Plus',

    // Event
    'event.sources': 'Sources',
    'event.relatedEvents': 'Événements Connexes',
    'event.share': 'Partager',
    'event.backToResults': 'Retour aux Résultats',
    'event.readFullOnWikipedia': "Lire l'article complet sur Wikipédia",
    'event.externalDisclaimer': "* Vous serez redirigé vers Wikipédia pour lire l'histoire complète.",

    // On This Day
    'onThisDay.title': 'Ce Jour-là',
    'onThisDay.subtitle': "Découvrez ce qui s'est passé le {date}",
    'onThisDay.selectDate': 'Sélectionner une date',

    // Articles
    'articles.title': 'Articles',
    'articles.readMore': 'Lire la Suite',
    'articles.readingTime': '{minutes} min de lecture',
    'articles.by': 'Par',

    // Categories
    'category.science': 'Science',
    'category.politics': 'Politique',
    'category.war': 'Guerre',
    'category.culture': 'Culture',
    'category.discovery': 'Découverte',
    'category.invention': 'Invention',
    'category.natural_disaster': 'Catastrophe Naturelle',
    'category.medicine': 'Médecine',
    'category.space': 'Espace',
    'category.religion': 'Religion',
    'category.economics': 'Économie',
    'category.sports': 'Sports',
    'category.art': 'Art',
    'category.literature': 'Littérature',

    // Months
    'month.1': 'Janvier',
    'month.2': 'Février',
    'month.3': 'Mars',
    'month.4': 'Avril',
    'month.5': 'Mai',
    'month.6': 'Juin',
    'month.7': 'Juillet',
    'month.8': 'Août',
    'month.9': 'Septembre',
    'month.10': 'Octobre',
    'month.11': 'Novembre',
    'month.12': 'Décembre',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.retry': 'Réessayer',
    'common.viewAll': 'Voir Tout',
    'common.learnMore': 'En Savoir Plus',

    // Theme
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',

    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.description': "Une plateforme pour explorer l'histoire et la science à travers le temps",

    // About
    'about.title': 'À Propos',
    'about.mission': 'Notre Mission',
    'about.missionText': "Nous visons à rendre l'histoire et la science accessibles à tous grâce à une plateforme interactive et facile à utiliser.",

    // Contact
    'contact.title': 'Contactez-nous',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer',

    // Privacy
    'privacy.title': 'Politique de Confidentialité',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getDirection(locale: Locale): Direction {
  return locales.find(l => l.code === locale)?.direction || 'ltr';
}

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return locales.find(l => l.code === locale) || locales[0];
}
