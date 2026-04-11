import { Share2, Link as LinkIcon, MessageCircle, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  variant?: "outline" | "ghost" | "default" | "glass";
  className?: string;
}

export default function ShareButton({ title, text, url, variant = "outline", className }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
  };

  const shareOnWhatsApp = () => {
    const msg = encodeURIComponent(`${text || title}: ${url}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  // If mobile and share API exists, use it directly
  const useNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className={className}>
      {useNativeShare ? (
        <Button
          variant={variant === "glass" ? "ghost" : variant}
          size="icon"
          onClick={handleShare}
          className={variant === "glass" ? "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full h-10 w-10 shadow-lg" : "rounded-full h-10 w-10"}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant === "glass" ? "ghost" : variant}
              size="icon"
              className={variant === "glass" ? "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full h-10 w-10 shadow-lg" : "rounded-full h-10 w-10"}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer gap-2">
              <MessageCircle className="h-4 w-4 text-green-500" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer gap-2">
              <LinkIcon className="h-4 w-4" />
              Copier le lien
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
