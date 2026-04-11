import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Package, Video, PlayCircle, MessageSquare,
  ShoppingCart, Settings, ArrowUpRight, TrendingUp,
  Clock, CheckCircle2, AlertCircle, Eye, Zap
} from "lucide-react";

const recentActivity = [
  { name: "Mehdi Alami", product: "iPhone 15 Pro Max", time: "Il y a 2h", status: "pending" },
  { name: "Sara Tazi", product: "AirPods Pro 2", time: "Il y a 5h", status: "done" },
  { name: "Youssef Bennani", product: "Apple Watch Ultra", time: "Hier 18:30", status: "pending" },
  { name: "Fatima Zahra", product: "iPhone 14 Pro", time: "Hier 14:00", status: "done" },
];

export default function DashboardHome() {
  const qc = useQueryClient();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "☀️ Good morning" : hour < 18 ? "🌤️ Good afternoon" : "🌙 Good evening";

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () =>
        qc.invalidateQueries({ queryKey: ["dash-products"] })
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "tiktok_videos" }, () =>
        qc.invalidateQueries({ queryKey: ["dash-tiktok"] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const { data: productCount = 0 } = useQuery({
    queryKey: ["dash-products"],
    queryFn: async () => {
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const { data: tiktokCount = 0 } = useQuery({
    queryKey: ["dash-tiktok"],
    queryFn: async () => {
      const { count } = await supabase.from("tiktok_videos").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const { data: youtubeCount = 0 } = useQuery({
    queryKey: ["dash-youtube"],
    queryFn: async () => {
      const { count } = await (supabase.from("youtube_videos" as any)).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const { data: testimonialCount = 0 } = useQuery({
    queryKey: ["dash-testimonials"],
    queryFn: async () => {
      const { count } = await (supabase.from("testimonials" as any)).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Produits", value: productCount, icon: Package, color: "#7c3aed", bg: "#f5f3ff", url: "/admin/products", trend: "+3 ce mois" },
    { label: "Vidéos TikTok", value: tiktokCount, icon: Video, color: "#db2777", bg: "#fdf2f8", url: "/admin/tiktok", trend: "En ligne" },
    { label: "Vidéos YouTube", value: youtubeCount, icon: PlayCircle, color: "#dc2626", bg: "#fef2f2", url: "/admin/youtube", trend: "Actif" },
    { label: "Témoignages", value: testimonialCount, icon: MessageSquare, color: "#d97706", bg: "#fffbeb", url: "/admin/testimonials", trend: "+5 cette sem." },
  ];

  const quickActions = [
    { label: "Nouveau Produit", sub: "Ajouter un article", icon: Package, url: "/admin/products", color: "#7c3aed" },
    { label: "Commandes", sub: "Voir les demandes", icon: ShoppingCart, url: "/admin/orders", color: "#059669" },
    { label: "Ajouter Vidéo", sub: "YouTube / TikTok", icon: PlayCircle, url: "/admin/youtube", color: "#dc2626" },
    { label: "Voir le site", sub: "Page publique", icon: Eye, url: "/", color: "#0077cc" },
    { label: "Réglages", sub: "WhatsApp, Social", icon: Settings, url: "/admin/settings", color: "#6b7280" },
    { label: "TikTok", sub: "Gérer les clips", icon: Video, url: "/admin/tiktok", color: "#db2777" },
  ];

  return (
    <div className="space-y-7" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #003366 0%, #005599 60%, #0088cc 100%)" }}>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 bg-white" style={{ clipPath: "ellipse(50% 70% at 100% 50%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-semibold mb-1">{greeting}, Admin</p>
            <h1 className="text-3xl font-black leading-tight">Tableau de bord</h1>
            <p className="text-blue-200/70 text-sm mt-1">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <Link to="/admin/products">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20 rounded-xl px-5 py-2.5 text-sm font-bold transition-all">
              <Zap className="h-4 w-4" /> Action rapide
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.url}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-gray-500 text-sm font-medium">{s.label}</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-semibold">
                <TrendingUp className="h-3 w-3" /> {s.trend}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-blue-600" />
            <h3 className="font-black text-gray-800 text-sm">Actions Rapides</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.url} className="group">
                <div className="rounded-xl border border-gray-100 p-3.5 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5"
                    style={{ backgroundColor: `${a.color}15` }}>
                    <a.icon className="h-4 w-4" style={{ color: a.color }} />
                  </div>
                  <div className="text-xs font-bold text-gray-800 group-hover:text-gray-900">{a.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{a.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h3 className="font-black text-gray-800 text-sm">Demandes Récentes</h3>
            </div>
            <Link to="/admin/orders"
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #003366, #0077cc)" }}>
                  {item.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{item.name}</div>
                  <div className="text-xs text-gray-400 truncate">{item.product}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {item.status === "done" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Fait
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                      <AlertCircle className="h-2.5 w-2.5" /> En attente
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
