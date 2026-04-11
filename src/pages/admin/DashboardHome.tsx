import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Video, ShoppingCart, MessageSquare, PlayCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-product-count"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tiktok_videos" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-video-count"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const { data: productCount } = useQuery({
    queryKey: ["admin-product-count"],
    queryFn: async () => {
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: tiktokCount } = useQuery({
    queryKey: ["admin-video-count"],
    queryFn: async () => {
      const { count } = await supabase.from("tiktok_videos").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: youtubeCount } = useQuery({
    queryKey: ["admin-youtube-count"],
    queryFn: async () => {
      const { count } = await supabase.from("youtube_videos" as any).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ["admin-testimonial-count"],
    queryFn: async () => {
      const { count } = await supabase.from("testimonials" as any).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { title: "Produits", value: productCount ?? 0, icon: Package, color: "bg-blue-500/10 text-blue-500", url: "/admin/products" },
    { title: "TikTok Videos", value: tiktokCount ?? 0, icon: Video, color: "bg-pink-500/10 text-pink-500", url: "/admin/tiktok" },
    { title: "YouTube Videos", value: youtubeCount ?? 0, icon: PlayCircle, color: "bg-red-500/10 text-red-500", url: "/admin/youtube" },
    { title: "Témoignages", value: testimonialCount ?? 0, icon: MessageSquare, color: "bg-amber-500/10 text-amber-500", url: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bonjour, Bienvenue 👋</h2>
        <p className="text-muted-foreground mt-1">Voici ce qui se passe sur votre site aujourd'hui.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Link key={s.title} to={s.url}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <div className={`p-2 rounded-lg ${s.color} group-hover:scale-110 transition-transform`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link to="/admin/products" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
              <Package className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Nouveau Produit</span>
            </Link>
            <Link to="/admin/youtube" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
              <PlayCircle className="h-6 w-6 mb-2 text-red-500" />
              <span className="text-xs font-medium">Ajouter Vidéo</span>
            </Link>
            <Link to="/admin/settings" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
              <Settings className="h-6 w-6 mb-2 text-gray-500" />
              <span className="text-xs font-medium">WhatsApp / Social</span>
            </Link>
            <Link to="/" target="_blank" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
              <ShoppingCart className="h-6 w-6 mb-2 text-green-500" />
              <span className="text-xs font-medium">Voir la boutique</span>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 border-dashed bg-muted/20">
          <CardContent className="h-full flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <h4 className="font-semibold text-muted-foreground">Analytiques à venir</h4>
            <p className="text-xs text-muted-foreground/60 max-w-[200px] mt-1">
              Les statistiques de vente et de visites seront bientôt disponibles ici.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
