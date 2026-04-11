import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Share2 } from "lucide-react";
import ShareButton from "./ShareButton";
import { useSettings } from "@/hooks/useSettings";

const TikTokGallery = () => {
  const { settings } = useSettings();
  const qc = useQueryClient();
  const { data: videos = [] } = useQuery({
    queryKey: ["public-tiktok-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tiktok_videos")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("tiktok-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tiktok_videos" }, () => {
        qc.invalidateQueries({ queryKey: ["public-tiktok-videos"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  if (videos.length === 0) return null;

  const handleWhatsApp = (videoId: string, title: string) => {
    const videoUrl = `https://www.tiktok.com/@chawnilive/video/${videoId}`;
    const msg = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par ce produit vu dans cette vidéo : ${videoUrl}`
    );
    window.open(`https://wa.me/${settings.whatsapp_number}?text=${msg}`, "_blank");
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-[hsl(var(--brand-tech))] mb-2 block">
            🎬 @chawnilive
          </span>
          <h2 className="text-3xl font-bold text-foreground">Our TikTok Reviews</h2>
          <p className="text-muted-foreground mt-2">
            Découvrez nos vidéos Battery Health & Unboxing en direct
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {videos.map((v) => (
            <div key={v.id} className="w-full max-w-[325px] flex flex-col gap-3">
              <div className="aspect-[9/16] rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.tiktok.com/player/v1/${v.video_id}?autoplay=1&muted=1&loop=1`}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={v.title || "TikTok video"}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleWhatsApp(v.video_id, v.title)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-whatsapp text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order via WhatsApp
                </button>
                <ShareButton 
                  title={v.title || "TikTok Video"}
                  url={`https://www.tiktok.com/@chawnilive/video/${v.video_id}`}
                  className="shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.tiktok.com/@chawnilive"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
          >
            Follow @chawnilive on TikTok
          </a>
        </div>
      </div>
    </section>
  );
};

export default TikTokGallery;
