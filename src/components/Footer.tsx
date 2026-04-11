import { MapPin } from "lucide-react";

const Facebook = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/useSettings";

export default function Footer() {
  const { t } = useLanguage();
  const { settings } = useSettings();

  return (
    <footer className="bg-[#1a1a1a] text-white/70 py-16 mt-auto">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg">OS</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">OriginalStore.ma</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed italic">
              "L'Excellence du High-Tech à Tanger." ✨
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-widest text-xs">{t("footer.followUs")}</h4>
            <div className="flex gap-4">
              <a 
                href={settings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={settings.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-widest text-xs">Localisation</h4>
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:border-primary/30 transition-colors">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="text-sm text-white/80 leading-snug">
                {settings.address}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <div>© {new Date().getFullYear()} OriginalStore.ma · {t("footer.rights")}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
