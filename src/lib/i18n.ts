export type Language = "fr" | "ar";

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      shop: "Boutique",
      iphone: "iPhone",
      watch: "Apple Watch",
      airpods: "AirPods",
      tradeIn: "Reprise",
      trackOrder: "Suivi",
      contact: "Contact",
    },
    hero: {
      title: "L'Original, Rien que l'Original",
      subtitle: "Spécialiste Apple certifié à Tanger. Smartphones vérifiés, garantie incluse.",
      shopNow: "Découvrir",
      tradeIn: "Reprendre mon ancien",
    },
    products: {
      batteryHealth: "Batterie",
      viewDetails: "Voir détails",
      addToCart: "Ajouter",
      flashSale: "Vente Flash",
      endsIn: "Se termine dans",
      featured: "Produits Vedettes",
      allProducts: "Tous les Produits",
      category: "Catégorie",
    },
    tradeIn: {
      title: "Reprise - الروبريز",
      subtitle: "Estimez la valeur de votre ancien appareil en quelques clics",
      model: "Modèle",
      battery: "Batterie %",
      condition: "État",
      conditionNew: "Excellent",
      conditionGood: "Bon",
      conditionFair: "Moyen",
      conditionPoor: "Mauvais",
      description: "Description additionnelle",
      submit: "Demander une estimation",
      success: "Demande envoyée avec succès!",
    },
    testimonials: {
      title: "Ce que disent nos clients",
      subtitle: "La confiance se construit sur l'authenticité",
    },
    footer: {
      rights: "Tous droits réservés",
      location: "Tanger, Maroc",
      followUs: "Suivez-nous",
    },
    whatsapp: {
      message: "Bonjour OriginalStore, je suis intéressé(e) par",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      shop: "المتجر",
      iphone: "آيفون",
      watch: "ساعة أبل",
      airpods: "إيربودز",
      tradeIn: "الروبريز",
      trackOrder: "تتبع الطلب",
      contact: "اتصل بنا",
    },
    hero: {
      title: "الأصلي، ما غيرو",
      subtitle: "متخصصون في منتجات أبل بطنجة. هواتف أصلية مع ضمان.",
      shopNow: "تسوق الآن",
      tradeIn: "بيع جهازك القديم",
    },
    products: {
      batteryHealth: "البطارية",
      viewDetails: "التفاصيل",
      addToCart: "أضف للسلة",
      flashSale: "عرض خاص",
      endsIn: "ينتهي في",
      featured: "منتجات مميزة",
      allProducts: "جميع المنتجات",
      category: "الفئة",
    },
    tradeIn: {
      title: "الروبريز - Reprise",
      subtitle: "قيّم جهازك القديم في دقائق",
      model: "الموديل",
      battery: "% البطارية",
      condition: "الحالة",
      conditionNew: "ممتاز",
      conditionGood: "جيد",
      conditionFair: "متوسط",
      conditionPoor: "ضعيف",
      description: "وصف إضافي",
      submit: "اطلب تقييم",
      success: "!تم إرسال الطلب بنجاح",
    },
    testimonials: {
      title: "آراء عملائنا",
      subtitle: "الثقة تُبنى على الأصالة",
    },
    footer: {
      rights: "جميع الحقوق محفوظة",
      location: "طنجة، المغرب",
      followUs: "تابعونا",
    },
    whatsapp: {
      message: "مرحبا OriginalStore، أنا مهتم بـ",
    },
  },
} as const;

export function t(lang: Language, path: string): string {
  const keys = path.split(".");
  let result: any = translations[lang];
  for (const key of keys) {
    result = result?.[key];
  }
  return result || path;
}
