import { Play } from "lucide-react";
import { useState } from "react";
import ShareButton from "./ShareButton";

interface VideoReel {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  category: "battery" | "unboxing";
}

const reels: VideoReel[] = [
  {
    id: "1",
    title: "Battery Health Check - iPhone 15 Pro Max",
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=700&fit=crop",
    videoUrl: "",
    category: "battery",
  },
  {
    id: "2",
    title: "Unboxing iPhone 14 Pro",
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=700&fit=crop",
    videoUrl: "",
    category: "unboxing",
  },
  {
    id: "3",
    title: "Battery 100% - iPhone 13",
    thumbnail: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=700&fit=crop",
    videoUrl: "",
    category: "battery",
  },
  {
    id: "4",
    title: "Unboxing AirPods Pro 2",
    thumbnail: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=700&fit=crop",
    videoUrl: "",
    category: "unboxing",
  },
  {
    id: "5",
    title: "Battery Health Test - iPhone 15",
    thumbnail: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=700&fit=crop",
    videoUrl: "",
    category: "battery",
  },
  {
    id: "6",
    title: "Unboxing Apple Watch Ultra",
    thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=700&fit=crop",
    videoUrl: "",
    category: "unboxing",
  },
];

function ReelCard({ reel }: { reel: VideoReel }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-card shadow-md group cursor-pointer aspect-[9/16]"
      onClick={() => setPlaying(!playing)}
    >
      {!playing || !reel.videoUrl ? (
        <>
          <img
            src={reel.thumbnail}
            alt={reel.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Share Button Overlay */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ShareButton 
              title={reel.title}
              url={window.location.href}
              variant="glass"
              className="relative z-30"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play className="h-7 w-7 text-white fill-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-[hsl(var(--brand-tech))]/20 text-[hsl(var(--brand-tech))]">
              {reel.category === "battery" ? "🔋 Battery Health" : "📦 Unboxing"}
            </span>
            <p className="text-white text-sm font-medium line-clamp-2">{reel.title}</p>
          </div>
        </>
      ) : (
        <video
          src={reel.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      )}
    </div>
  );
}

export default function TikTokVideoFeed() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-[hsl(var(--brand-tech))] mb-2 block">
            🎬 TikTok Live
          </span>
          <h2 className="text-3xl font-bold text-foreground">Nos Vidéos</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Battery Health vérifiée en direct & Unboxing de chaque produit
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
