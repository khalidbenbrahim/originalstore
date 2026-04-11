import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bell, User as UserIcon, ChevronDown } from "lucide-react";

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f1a] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <p className="text-gray-500 text-sm animate-pulse">Vérification des accès...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f1a] p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <span className="text-4xl">🚫</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Accès refusé</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Vous n'avez pas les permissions nécessaires pour accéder à cette zone.</p>
        <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
          <Link to="/">Retour au site</Link>
        </Button>
      </div>
    );
  }

  const displayName = user.email?.split("@")[0] ?? "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#0f0f1a] font-sans antialiased">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between border-b border-white/5 px-4 md:px-6 bg-[#0f0f1a]/80 backdrop-blur sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-400 hover:text-white hover:bg-white/5 h-9 w-9 rounded-lg transition-colors" />
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              <nav className="hidden sm:flex items-center gap-1 text-sm">
                <span className="text-gray-600">Dashboard</span>
                <span className="text-gray-700 mx-1">/</span>
                <span className="text-gray-300 font-medium">Tableau de bord</span>
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden md:flex gap-2 text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-lg">
                <Link to="/" target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Voir le site
                </Link>
              </Button>

              <button className="relative h-9 w-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border border-[#0f0f1a]" />
              </button>

              <div className="flex items-center gap-2.5 pl-3 border-l border-white/10 ml-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-black text-white shadow-md">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-sm font-semibold text-white">{displayName}</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Administrateur</span>
                </div>
                <button onClick={signOut} className="text-gray-600 hover:text-gray-400 transition-colors ml-1">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>

          <footer className="border-t border-white/5 px-6 py-4 text-center text-xs text-gray-700">
            OriginalStore Admin Dashboard • © {new Date().getFullYear()} • Tous droits réservés
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
