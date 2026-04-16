import { Product } from "./products";
import { Database } from "@/integrations/supabase/types";

type DBProduct = Database["public"]["Tables"]["products"]["Row"];

export function mapDbProductToFrontend(dbProduct: DBProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    nameAr: dbProduct.name_ar,
    category: dbProduct.category as Product["category"],
    price: Number(dbProduct.price),
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
    image: dbProduct.image,
    batteryHealth: dbProduct.battery_health ?? undefined,
    storage: dbProduct.storage ?? undefined,
    color: dbProduct.color,
    colorAr: dbProduct.color_ar,
    isFlashSale: dbProduct.is_flash_sale,
    isFeatured: (dbProduct as any).is_featured ?? false,
    flashSaleEnds: dbProduct.flash_sale_ends ?? undefined,
    inStock: dbProduct.in_stock,
  };
}
