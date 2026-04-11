import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { products, Product } from "@/lib/products";
import { openWhatsApp } from "@/components/WhatsAppButton";
import { useSettings } from "@/hooks/useSettings";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const categories = ["all", "iphone", "watch", "airpods"] as const;

export default function Shop() {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();
  const [category, setCategory] = useState<string>("all");

  const filtered = category === "all" ? products : products.filter((p) => p.category === category);
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
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onWhatsApp={handleWhatsApp} />
          ))}
        </div>
      </div>
    </section>
  );
}
