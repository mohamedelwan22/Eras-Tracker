import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Calendar, Globe, Tag, SlidersHorizontal, ArrowUpDown, Shuffle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { categories } from '@/lib/mocks';
import { SearchParams } from '@/lib/types';
import { getCountries } from '@/utils/countries';

const currentYear = new Date().getFullYear();

const searchSchema = z.object({
    query: z.string().optional(),
    year: z.coerce
        .number()
        .min(-10000, 'Year must be after 10000 BCE')
        .max(currentYear, `Year cannot be in the future`)
        .optional()
        .or(z.literal('')),
    category: z.string().optional(),
    country: z.string().optional(),
    sortBy: z.enum(['date', 'importance']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    onRandom?: () => void;
    initialValues?: Partial<SearchParams>;
    isLoading?: boolean;
}

export function SearchForm({ onSearch, onRandom, initialValues, isLoading }: SearchFormProps) {
    const { t } = useApp();

    const allCountries = useMemo(() => getCountries(), []);

    const form = useForm<SearchFormData>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            query: initialValues?.query || '',
            year: initialValues?.year,
            category: initialValues?.category || 'all',
            country: initialValues?.country || 'all',
            sortBy: initialValues?.sortBy || 'date',
            sortOrder: initialValues?.sortOrder || 'desc',
        },
    });

    const onSubmit = (data: SearchFormData) => {
        const params: SearchParams = {
            ...data,
            category: data.category === 'all' ? undefined : (data.category as any),
            country: data.country === 'all' ? undefined : data.country,
            limit: 12,
            page: 1,
        };
        onSearch(params);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Keyword Search */}
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel className="flex items-center gap-2">
                                    <Search className="w-4 h-4 text-primary" />
                                    {t('search.title')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Search by keywords (e.g. Apollo, Revolution...)"
                                        {...field}
                                        className="h-12 bg-muted/50 focus:bg-background transition-colors"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Year */}
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {t('search.year')} *
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder={t('search.yearPlaceholder')}
                                        {...field}
                                        className="h-12 bg-muted/50 focus:bg-background transition-colors"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category - Optional */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-primary" />
                                    {t('search.category')}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-muted/50 focus:bg-background transition-colors">
                                            <SelectValue placeholder={t('search.categoryPlaceholder')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-popover">
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {t(`category.${category}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    {/* Country - Optional */}
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    {t('search.country')}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-muted/50 focus:bg-background transition-colors">
                                            <SelectValue placeholder={t('search.countryPlaceholder')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-popover max-h-[300px]">
                                        <SelectItem value="all">All Countries</SelectItem>
                                        {allCountries.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>


                <div className="flex flex-col sm:flex-row gap-6 pt-2 border-t border-border/50">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        {/* Sort By */}
                        <FormField
                            control={form.control}
                            name="sortBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                                        {t('results.sortBy')}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="date">{t('results.sortByDate')}</SelectItem>
                                            <SelectItem value="importance">{t('results.sortByImportance')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Sort Order */}
                        <FormField
                            control={form.control}
                            name="sortOrder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <ArrowUpDown className="w-4 h-4 text-primary" />
                                        Order
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                        <Button
                            type="submit"
                            size="lg"
                            className="flex-1 sm:flex-none h-12 px-8 gap-2"
                            disabled={isLoading || !form.formState.isValid}
                        >
                            <Search className="w-5 h-5" />
                            {t('search.submit')}
                        </Button>

                        {onRandom && (
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={onRandom}
                                className="flex-1 sm:flex-none h-12 px-8 gap-2 group transition-all"
                                disabled={isLoading}
                            >
                                <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                Random
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    );
}
