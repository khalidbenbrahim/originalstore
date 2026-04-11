import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/useSettings";

export function openWhatsApp(product: any | null, lang: "fr" | "ar", phoneNumber: string) {
  const baseMsg =
    lang === "ar"
      ? `مرحبا OriginalStore، أنا مهتم بـ`
      : `Bonjour OriginalStore, je suis intéressé(e) par`;

  const productInfo = product
    ? ` ${product.name} (${product.price.toLocaleString()} MAD) - ${window.location.origin}/shop`
    : "";

  const msg = encodeURIComponent(baseMsg + productInfo);
  window.open(`https://wa.me/${phoneNumber}?text=${msg}`, "_blank");
}

export default function WhatsAppButton() {
  const { lang } = useLanguage();
  const { settings } = useSettings();

  return (
    <button
      onClick={() => openWhatsApp(null, lang, settings.whatsapp_number)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
