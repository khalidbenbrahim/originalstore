import { useState, useEffect } from "react";
import { Flame, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { products, Product } from "@/lib/products";
import ProductCard from "./ProductCard";

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <Clock className="h-4 w-4" />
      <span className="bg-foreground text-background px-2 py-1 rounded">{pad(timeLeft.h)}</span>:
      <span className="bg-foreground text-background px-2 py-1 rounded">{pad(timeLeft.m)}</span>:
      <span className="bg-foreground text-background px-2 py-1 rounded">{pad(timeLeft.s)}</span>
    </div>
  );
}

export default function FlashSaleSection({ onWhatsApp }: { onWhatsApp: (p: Product) => void }) {
  const { t } = useLanguage();
  const flashOriginal = products.filter((p) => p.isFlashSale);
  const flashProducts = flashOriginal.length > 0 
    ? Array.from({ length: 6 }).map((_, i) => ({ ...flashOriginal[i % flashOriginal.length], id: `flash-${i}` }))
    : [];

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-destructive/5 via-background to-destructive/5">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-xl">
              <Flame className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t("products.flashSale")}</h2>
              <p className="text-sm text-muted-foreground">TikTok Live Deals 🎬</p>
            </div>
          </div>
          {flashProducts[0]?.flashSaleEnds && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("products.endsIn")}</span>
              <CountdownTimer endTime={flashProducts[0].flashSaleEnds} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} onWhatsApp={onWhatsApp} />
          ))}
        </div>
      </div>
    </section>
  );
}
