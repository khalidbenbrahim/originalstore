import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Video, ShoppingCart, MessageSquare, PlayCircle, Settings, TrendingUp, ArrowUpRight, Zap, Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHome() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const displayName = user?.email?.split("@")[0] ?? "Admin";

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
      const { count } = await (supabase.from("youtube_videos" as any)).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ["admin-testimonial-count"],
    queryFn: async () => {
      const { count } = await (supabase.from("testimonials" as any)).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    {
      title: "Produits actifs",
      value: productCount ?? 0,
      icon: Package,
      color: "from-violet-600 to-violet-400",
      bgColor: "bg-violet-500/10",
      textColor: "text-violet-400",
      url: "/admin/products",
      trend: "+3 ce mois",
    },
    {
      title: "Vidéos TikTok",
      value: tiktokCount ?? 0,
      icon: Video,
      color: "from-pink-600 to-rose-400",
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-400",
      url: "/admin/tiktok",
      trend: "Actif",
    },
    {
      title: "Vidéos YouTube",
      value: youtubeCount ?? 0,
      icon: PlayCircle,
      color: "from-red-600 to-orange-400",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      url: "/admin/youtube",
      trend: "En direct",
    },
    {
      title: "Témoignages",
      value: testimonialCount ?? 0,
      icon: MessageSquare,
      color: "from-amber-500 to-yellow-400",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-400",
      url: "/admin/testimonials",
      trend: "+5 cette semaine",
    },
  ];

  const quickActions = [
    { title: "Nouveau Produit", desc: "Ajouter à l'inventaire", icon: Package, url: "/admin/products", color: "from-violet-600 to-violet-500" },
    { title: "Ajouter Vidéo", desc: "YouTube ou TikTok", icon: PlayCircle, url: "/admin/youtube", color: "from-red-600 to-orange-500" },
    { title: "Réglages", desc: "WhatsApp, Réseaux", icon: Settings, url: "/admin/settings", color: "from-gray-700 to-gray-600" },
    { title: "Voir Boutique", desc: "Vue publique du site", icon: Eye, url: "/", color: "from-blue-600 to-cyan-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-[#0f0f1a] to-violet-900/30 border border-white/5 rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-blue-400 font-semibold text-sm mb-1">{greeting}, {displayName} 👋</p>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Tableau de bord
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Vue d'ensemble de votre boutique OriginalStore — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/admin/products">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/30">
              <Zap className="h-4 w-4" />
              Action rapide
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.title} to={s.url}>
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`${s.bgColor} p-2.5 rounded-xl`}>
                  <s.icon className={`h-5 w-5 ${s.textColor}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className={`text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`}>
                {s.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">{s.title}</div>
              <div className="text-gray-700 text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                {s.trend}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Actions Rapides</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.title} to={a.url} className="group">
                <div className="bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-200 cursor-pointer">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <a.icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{a.title}</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users className="h-4 w-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Demandes Récentes</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "Mehdi Alami", product: "iPhone 15 Pro Max", time: "Il y a 2h", status: "pending" },
              { name: "Sara Tazi", product: "AirPods Pro 2", time: "Il y a 5h", status: "done" },
              { name: "Youssef Bennani", product: "Apple Watch Ultra", time: "Hier", status: "pending" },
              { name: "Fatima Z.", product: "iPhone 14", time: "Hier", status: "done" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-black text-white">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.product}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    item.status === "done"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {item.status === "done" ? "Finalisé" : "En attente"}
                  </span>
                  <span className="text-[10px] text-gray-700">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-4 font-medium">
            Voir toutes les demandes
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
