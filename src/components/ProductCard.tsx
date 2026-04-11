import { Battery, Eye, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShareButton from "./ShareButton";

interface Props {
  product: Product;
  onWhatsApp: (product: Product) => void;
}

export default function ProductCard({ product, onWhatsApp }: Props) {
  const { t, lang } = useLanguage();
  const name = lang === "ar" ? product.nameAr : product.name;
  const color = lang === "ar" ? product.colorAr : product.color;
  const productUrl = `${window.location.origin}/shop?id=${product.id}`;

  return (
    <Card className="group overflow-hidden border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      {/* Images Carousel */}
      <div className="relative aspect-square bg-secondary/50 overflow-hidden group/carousel">
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(product.images || [product.image, product.image, product.image]).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${name} - ${idx + 1}`}
              className="w-full flex-shrink-0 h-full object-cover snap-center transition-transform duration-500"
              loading="lazy"
            />
          ))}
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.batteryHealth && (
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm gap-1">
              <Battery className="h-3 w-3" />
              {product.batteryHealth}%
            </Badge>
          )}
          {product.isFlashSale && (
            <Badge className="bg-destructive/90 text-destructive-foreground backdrop-blur-sm animate-pulse">
              🔥 Flash
            </Badge>
          )}
        </div>
        
        {/* Share Button Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 transition-all duration-300">
          <ShareButton 
            title={name}
            url={productUrl}
            variant="glass"
            className="opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity scale-90"
          />
        </div>

        {product.originalPrice && (
          <Badge variant="secondary" className="absolute bottom-2 left-2 backdrop-blur-sm shadow-sm">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </Badge>
        )}
      </div>

      <CardContent className="p-3">
        <div className="mb-0.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
          {color} {product.storage && `· ${product.storage}`}
        </div>
        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 leading-snug">{name}</h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mt-auto">
          <div>
            <span className="text-lg font-bold text-foreground">{product.price.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground ml-0.5 uppercase">MAD</span>
            {product.originalPrice && (
              <span className="block text-xs text-muted-foreground line-through opacity-80">
                {product.originalPrice.toLocaleString()} MAD
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="rounded-lg h-8 text-xs w-full sm:w-auto font-medium"
            onClick={() => onWhatsApp(product)}
          >
            {t("products.viewDetails")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
