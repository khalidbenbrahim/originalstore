export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: "iphone" | "watch" | "airpods";
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  batteryHealth?: number;
  storage?: string;
  color: string;
  colorAr: string;
  isFlashSale?: boolean;
  isFeatured?: boolean;
  flashSaleEnds?: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone XR",
    nameAr: "آيفون XR",
    category: "iphone",
    price: 1799,
    originalPrice: 1900,
    image: "/66c7aaf9-5ee9-4c95-b1f3-ff97b385e413.jpg",
    batteryHealth: 83,
    storage: "64GB",
    color: "ORANGE",
    colorAr: "برتقالي",
    isFlashSale: true,
    flashSaleEnds: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    inStock: true,
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    nameAr: "آيفون 15 برو",
    category: "iphone",
    price: 10999,
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=600&h=600&fit=crop",
    batteryHealth: 98,
    storage: "128GB",
    color: "Blue Titanium",
    colorAr: "تيتانيوم أزرق",
    inStock: true,
  },
  {
    id: "3",
    name: "iPhone 14 Pro Max",
    nameAr: "آيفون 14 برو ماكس",
    category: "iphone",
    price: 9499,
    originalPrice: 10999,
    image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600&h=600&fit=crop",
    batteryHealth: 92,
    storage: "256GB",
    color: "Deep Purple",
    colorAr: "بنفسجي غامق",
    isFlashSale: true,
    flashSaleEnds: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    inStock: true,
  },
  {
    id: "4",
    name: "iPhone 14",
    nameAr: "آيفون 14",
    category: "iphone",
    price: 6999,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=600&fit=crop",
    batteryHealth: 95,
    storage: "128GB",
    color: "Midnight",
    colorAr: "أسود",
    inStock: true,
  },
  {
    id: "5",
    name: "Apple Watch Ultra 2",
    nameAr: "ساعة أبل ألترا 2",
    category: "watch",
    price: 8999,
    image: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/111832-watch-ultra-2.png",
    color: "Titanium",
    colorAr: "تيتانيوم",
    inStock: true,
  },
  {
    id: "6",
    name: "Apple Watch Series 9",
    nameAr: "ساعة أبل سيريس 9",
    category: "watch",
    price: 4499,
    image: "https://scontent.frba4-1.fna.fbcdn.net/v/t39.30808-6/610951233_1200929288810576_8251647045903844243_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeEbBeHrJO65Zb84fl6AiobH77bZdGJ6ckbvttl0YnpyRhMQUATleFJM1bfKuSSWHBVIVGiuP4T84H_KhkgfTlt2&_nc_ohc=tcN9L1BRrMsQ7kNvwEwPu8U&_nc_oc=AdoT_-Tqvo247DKtEmDyZHFvsIetLfR3rb-gCQ6YI_jfUto0kGOsrIRDsSFa0HV3MGY&_nc_zt=23&_nc_ht=scontent.frba4-1.fna&_nc_gid=1O88LGvwXm65EdXNVkaSAw&_nc_ss=7a3a8&oh=00_Af2bdv0uoK1fJzIz8CvOkNBe9oLrboQSg2oJDC1pXiyJxQ&oe=69DE2AFC",
    color: "Starlight",
    colorAr: "ضوء النجوم",
    inStock: true,
  },
  {
    id: "7",
    name: "AirPods Pro 2",
    nameAr: "إيربودز برو 2",
    category: "airpods",
    price: 2799,
    originalPrice: 3199,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop",
    color: "White",
    colorAr: "أبيض",
    inStock: true,
  },
  {
    id: "8",
    name: "AirPods Max",
    nameAr: "إيربودز ماكس",
    category: "airpods",
    price: 5999,
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&h=600&fit=crop",
    color: "Silver",
    colorAr: "فضي",
    inStock: true,
  },
];
