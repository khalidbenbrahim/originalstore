import { useEffect, useState } from "react";
import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { isAdminSession, adminLogout } from "@/lib/adminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bell, LogOut } from "lucide-react";

export default function AdminLayout() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthed(isAdminSession());
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="w-10 h-10 rounded-full border-[3px] border-blue-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (!authed) return <Navigate to="/admin/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-16 flex items-center justify-between border-b border-gray-100 px-4 md:px-6 bg-white sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 h-9 w-9 rounded-lg transition-colors" />
              <div className="h-5 w-px bg-gray-200 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5 text-sm">
                <span className="text-gray-400">Admin</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700 font-semibold">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="outline" size="sm" asChild
                className="hidden md:flex gap-2 text-gray-600 border-gray-200 hover:bg-gray-50 rounded-lg h-9 text-xs font-medium">
                <Link to="/" target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" /> View site
                </Link>
              </Button>
              <button className="relative h-9 w-9 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-white" />
              </button>
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #003366, #0077cc)" }}>
                  AD
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-gray-800 leading-tight">admin</div>
                  <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Administrator</div>
                </div>
                <button onClick={handleLogout} className="ml-1 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>

          <footer className="border-t border-gray-100 bg-white px-6 py-3 text-center text-xs text-gray-400">
            ChawniLive Admin © {new Date().getFullYear()} — OriginalStore.ma
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
