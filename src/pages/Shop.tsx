import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/lib/products";
import { mapDbProductToFrontend } from "@/lib/dataMapping";
import { openWhatsApp } from "@/components/WhatsAppButton";
import { useSettings } from "@/hooks/useSettings";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["all", "iphone", "watch", "airpods"] as const;

export default function Shop() {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();
  const [category, setCategory] = useState<string>("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["public-products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*").eq("in_stock", true);
      
      if (category !== "all") {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]).map(mapDbProductToFrontend);
    },
  });

  const handleWhatsApp = (p: Product) => openWhatsApp(p, lang, settings.whatsapp_number);

  const categoryLabels: Record<string, string> = {
    all: t("products.allProducts"),
    iphone: t("nav.iphone"),
    watch: t("nav.watch"),
    airpods: t("nav.airpods"),
  };

  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("nav.shop")}</h1>
        <p className="text-muted-foreground mb-8">{t("products.allProducts")}</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              onClick={() => setCategory(cat)}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground">{t("products.noProducts") || "Aucun produit trouvé dans cette catégorie."}</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} onWhatsApp={handleWhatsApp} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
