import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/articles/${article.slug}`}>
        <motion.article
          className="group bg-card rounded-2xl overflow-hidden border border-border card-hover h-full"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={article.coverImageUrl}
              alt={getLocalizedTitle()}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 start-4">
              <span className="category-badge">{article.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {getLocalizedTitle()}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2">
              {getLocalizedExcerpt()}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                {article.author.avatarUrl && (
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span className="text-xs text-muted-foreground">{article.author.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('articles.readingTime', { minutes: article.readingTime })}</span>
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
