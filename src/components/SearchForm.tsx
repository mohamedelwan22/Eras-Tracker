import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Shuffle, Calendar, Globe, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { categories, mockCountries } from '@/lib/mocks';
import { SearchParams } from '@/lib/types';

const currentYear = new Date().getFullYear();

const searchSchema = z.object({
  year: z.coerce
    .number()
    .min(-10000, 'Year must be after 10000 BCE')
    .max(currentYear, `Year cannot be in the future`),
  month: z.string().optional(),
  day: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch?: (params: SearchParams) => void;
  compact?: boolean;
}

export function SearchForm({ onSearch, compact = false }: SearchFormProps) {
  const { t, locale, direction } = useApp();
  const navigate = useNavigate();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      year: undefined,
      month: undefined,
      day: undefined,
      category: undefined,
      country: undefined,
    },
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: t(`month.${i + 1}`),
  }));

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const getCountryName = (country: typeof mockCountries[0]) => {
    if (locale === 'ar') return country.nameAr;
    if (locale === 'fr') return country.nameFr;
    return country.name;
  };

  const handleSubmit = (data: SearchFormData) => {
    const params: SearchParams = {
      year: data.year,
      month: data.month ? parseInt(data.month) : undefined,
      day: data.day ? parseInt(data.day) : undefined,
      category: data.category as any,
      country: data.country,
    };

    if (onSearch) {
      onSearch(params);
    } else {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      navigate(`/results?${searchParams.toString()}`);
    }
  };

  const handleRandomSearch = () => {
    const randomYear = Math.floor(Math.random() * 3000) - 500; // -500 to 2500
    navigate(`/results?year=${randomYear}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className={`grid gap-4 ${compact ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'}`}>
          {/* Year - Required */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className={compact ? '' : 'md:col-span-1'}>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('search.year')} *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('search.yearPlaceholder')}
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Month - Optional */}
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('search.month')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('search.monthPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover">
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Day - Optional */}
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('search.day')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('search.dayPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover">
                    {days.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Tag className="w-4 h-4" />
                  {t('search.category')}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('search.categoryPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover">
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
                  <Globe className="w-4 h-4" />
                  {t('search.country')}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('search.countryPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover">
                    {mockCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {getCountryName(country)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className={`flex gap-3 ${compact ? 'flex-row' : 'flex-col sm:flex-row'}`}>
          <Button
            type="submit"
            size="lg"
            className="flex-1 h-12 gap-2"
          >
            <Search className="w-5 h-5" />
            {t('search.submit')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleRandomSearch}
            className="h-12 gap-2"
          >
            <Shuffle className="w-5 h-5" />
            {t('search.random')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
