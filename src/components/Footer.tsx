import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Phone, MessageCircle, Mail, Music2 } from 'lucide-react';

export function Footer() {
  const { t } = useApp();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('nav.about'),
      links: [
        { label: t('nav.about'), path: '/about' },
        { label: t('nav.contact'), path: '/contact' },
        { label: t('nav.privacy'), path: '/privacy' },
      ],
    },
    {
      title: t('nav.search'),
      links: [
        { label: t('nav.search'), path: '/search' },
        { label: t('nav.onThisDay'), path: '/on-this-day' },
        { label: t('nav.articles'), path: '/articles' },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-primary-foreground font-display font-bold text-xl">E</span>
              </motion.div>
              <span className="font-display text-xl font-semibold">EraTracker</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="tel:+01210923756"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/01210923756"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:Support@eratracker.com"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@eratracker"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="TikTok"
              >
                <Music2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} EraTracker. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
