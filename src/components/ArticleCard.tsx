import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const { locale, t } = useApp();

  const getLocalizedTitle = () => {
    if (locale === 'ar' && article.titleAr) return article.titleAr;
    if (locale === 'fr' && article.titleFr) return article.titleFr;
    return article.title;
  };

  const getLocalizedExcerpt = () => {
    if (locale === 'ar' && article.excerptAr) return article.excerptAr;
    if (locale === 'fr' && article.excerptFr) return article.excerptFr;
    return article.excerpt;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/articles/${article.slug}`}>
        <motion.article
          className="group grid grid-cols-1 md:grid-cols-12 bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 h-full"
          whileHover={{ y: -2 }}
        >
          {/* Image Part - 40% on Desktop */}
          <div className="md:col-span-4 relative aspect-video md:aspect-auto overflow-hidden bg-muted">
            <img
              src={article.coverImageUrl}
              alt={getLocalizedTitle()}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content Part - 60% on Desktop */}
          <div className="md:col-span-8 p-6 md:p-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-tight">
                {article.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                <span>{t('articles.readingTime', { minutes: article.readingTime })}</span>
              </div>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground line-clamp-2 leading-tight mb-4 group-hover:text-primary transition-colors text-start">
              {getLocalizedTitle()}
            </h3>

            <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 mb-6 text-start">
              {getLocalizedExcerpt()}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                {article.author.id === 'eras-team' ? (
                  <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center border border-border">
                    <span className="text-primary-foreground font-display font-bold text-[10px]">E</span>
                  </div>
                ) : article.author.avatarUrl ? (
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-border"
                  />
                ) : null}
                <span className="text-xs font-medium text-muted-foreground">{article.author.name}</span>
              </div>

              <div className="flex items-center gap-1.5 text-primary text-sm font-bold group-hover:gap-2.5 transition-all rtl:flex-row-reverse">
                {t('articles.readMore')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
