import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}




export default function TestimonialsSection() {
  const { t, lang } = useLanguage();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials" as any)
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) return [];
      return data as unknown as (Testimonial & { text_ar?: string })[];
    },
  });

  if (!isLoading && testimonials.length === 0) return null;


  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">{t("testimonials.title")}</h2>
          <p className="text-muted-foreground">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((review: any, idx) => (
            <Card key={review.id || idx} className="border-border/50 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4">
                  {(lang === "ar" && review.text_ar) ? review.text_ar : review.text}
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <div className="text-sm font-semibold text-foreground">{review.name}</div>
                {review.product && (
                  <div className="text-xs text-muted-foreground">{review.product}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
