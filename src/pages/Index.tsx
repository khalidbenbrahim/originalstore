import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/lib/products";
import { mapDbProductToFrontend } from "@/lib/dataMapping";
import { openWhatsApp } from "@/components/WhatsAppButton";
import { useSettings } from "@/hooks/useSettings";
import HeroSection from "@/components/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

import FlashSaleSection from "@/components/FlashSaleSection";
import YouTubeLiveSection from "@/components/YouTubeLiveSection";
import TikTokGallery from "@/components/TikTokGallery";
import FacebookNewsSection from "@/components/FacebookNewsSection";
import ProductCard from "@/components/ProductCard";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Index() {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();

  const { data: featured = [], isLoading } = useQuery({
    queryKey: ["public-featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .eq("is_featured" as any, true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data as any[]).map(mapDbProductToFrontend);
    },
  });

  const handleWhatsApp = (p: Product) => openWhatsApp(p, lang, settings.whatsapp_number);

  return (
    <>
      <HeroSection />
      
      <FlashSaleSection onWhatsApp={handleWhatsApp} />

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t("products.featured")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : featured.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-muted-foreground">{t("products.noProducts") || "Aucun produit disponible pour le moment."}</p>
              </div>
            ) : (
              featured.map((product) => (
                <ProductCard key={product.id} product={product} onWhatsApp={handleWhatsApp} />
              ))
            )}
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
