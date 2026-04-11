import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink, User as UserIcon } from "lucide-react";

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <ExternalLink className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
        <p className="text-muted-foreground mb-6">Vous n'avez pas les permissions nécessaires pour accéder à cette zone.</p>
        <Button asChild variant="outline">
          <Link to="/">Retour au site</Link>
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/5 font-sans antialiased">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b px-6 bg-white dark:bg-black sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted" />
              <div className="h-4 w-[1px] bg-border hidden sm:block" />
              <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
                <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">Dashboard</Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hidden md:flex gap-2">
                <Link to="/" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Voir le site
                </Link>
              </Button>
              <div className="h-4 w-[1px] bg-border mr-2" />
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold">{user.email?.split('@')[0]}</span>
                  <span className="text-[10px] text-primary uppercase font-bold tracking-tighter">Administrateur</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
