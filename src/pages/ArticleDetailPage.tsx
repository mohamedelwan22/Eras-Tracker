import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { getArticleBySlug } from '@/lib/api';
import { Article } from '@/lib/types';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useApp();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const response = await getArticleBySlug(slug);
        if (response.success) setArticle(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="aspect-video bg-muted rounded-2xl" />
            <div className="h-12 w-3/4 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
          <Button asChild><Link to="/articles">{t('articles.title')}</Link></Button>
        </div>
      </Layout>
    );
  }

  const title = locale === 'ar' && article.titleAr ? article.titleAr : locale === 'fr' && article.titleFr ? article.titleFr : article.title;
  const content = locale === 'ar' && article.contentAr ? article.contentAr : locale === 'fr' && article.contentFr ? article.contentFr : article.content;

  return (
    <Layout>
      <article className="py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to="/articles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />Back to Articles
            </Link>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={article.coverImageUrl}
              alt={title}
              className="w-full aspect-video object-cover rounded-2xl mb-8"
            />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-6">{title}</h1>
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  {article.author.avatarUrl && <img src={article.author.avatarUrl} alt={article.author.name} className="w-10 h-10 rounded-full" />}
                  <span className="text-muted-foreground">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime} min</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">{content}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </article>
    </Layout>
  );
}
