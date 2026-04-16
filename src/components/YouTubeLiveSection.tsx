import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Play, MessageCircle, Share2, ArrowRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShareButton from "./ShareButton";

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  category: "battery" | "unboxing" | string;
}

const VideoCard = ({
  video,
  onPlay,
}: {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-card shadow-md group cursor-pointer aspect-video"
      onClick={() => onPlay(video)}
    >
      <img
        src={thumbnailUrl}
        alt={video.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-destructive/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-destructive transition-colors">
          <Play className="h-7 w-7 text-white fill-white ml-1" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 bg-[hsl(var(--brand-tech))]/20 text-[hsl(var(--brand-tech))]">
          {video.category === "battery" ? "🔋 Battery Health" : "📦 Unboxing"}
        </span>
        <p className="text-white text-sm font-medium line-clamp-2">
          {video.title}
        </p>
      </div>
    </div>
  );
}

export default function YouTubeLiveSection() {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const { settings } = useSettings();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["public-youtube-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_videos" as any)
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) return [];
      return data as unknown as YouTubeVideo[];
    },
  });

  if (!isLoading && videos.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-destructive mb-2 flex items-center justify-center gap-1">
            ▶️ YouTube Live
          </span>
          <h2 className="text-3xl font-bold text-foreground">Nos Vidéos</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Tests de batterie et Unboxing en direct sur notre chaîne
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col gap-4">
              <VideoCard
                video={video}
                onPlay={setSelectedVideo}
              />
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Bonjour OriginalStore, je souhaite avoir plus d'informations sur la vidéo: ${video.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-whatsapp text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                   WhatsApp
                </a>
                <ShareButton 
                  title={video.title}
                  url={`https://www.youtube.com/watch?v=${video.video_id}`} 
                  className="shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/@chawnilive"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            ▶️ S'abonner à @chawnilive
          </a>
        </div>
      </div>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
