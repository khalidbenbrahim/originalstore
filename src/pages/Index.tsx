import { useLanguage } from "@/contexts/LanguageContext";
import { products, Product } from "@/lib/products";
import { openWhatsApp } from "@/components/WhatsAppButton";
import { useSettings } from "@/hooks/useSettings";
import HeroSection from "@/components/HeroSection";

import FlashSaleSection from "@/components/FlashSaleSection";
import YouTubeLiveSection from "@/components/YouTubeLiveSection";
import TikTokGallery from "@/components/TikTokGallery";
import FacebookNewsSection from "@/components/FacebookNewsSection";
import ProductCard from "@/components/ProductCard";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Index() {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();
  const handleWhatsApp = (p: Product) => openWhatsApp(p, lang, settings.whatsapp_number);
  const featuredOriginal = products.filter((p) => !p.isFlashSale);
  const featured = featuredOriginal.length > 0
    ? Array.from({ length: 8 }).map((_, i) => ({
        ...featuredOriginal[i % featuredOriginal.length],
        id: `featured-${i}`
      }))
    : [];

  return (
    <>
      <HeroSection />
      
      <FlashSaleSection onWhatsApp={handleWhatsApp} />

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t("products.featured")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onWhatsApp={handleWhatsApp} />
            ))}
          </div>
        </div>
      </section>

      <YouTubeLiveSection />
      <TikTokGallery />
      <FacebookNewsSection />
      <TestimonialsSection />
    </>
  );
}
