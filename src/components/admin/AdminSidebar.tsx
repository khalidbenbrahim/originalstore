import { 
  LayoutDashboard, 
  Package, 
  Video, 
  PlayCircle, 
  MessageSquare, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Monitor,
  Zap,
  ChevronRight
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const menuGroups = [
  {
    label: "Vue globale",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, color: "text-blue-400" },
    ]
  },
  {
    label: "Boutique",
    items: [
      { title: "Produits", url: "/admin/products", icon: Package, color: "text-violet-400" },
      { title: "Commandes", url: "/admin/orders", icon: ShoppingCart, color: "text-emerald-400" },
    ]
  },
  {
    label: "Contenu",
    items: [
      { title: "Vidéos TikTok", url: "/admin/tiktok", icon: Video, color: "text-pink-400" },
      { title: "Vidéos YouTube", url: "/admin/youtube", icon: PlayCircle, color: "text-red-400" },
      { title: "Témoignages", url: "/admin/testimonials", icon: MessageSquare, color: "text-amber-400" },
    ]
  },
  {
    label: "Système",
    items: [
      { title: "Réglages", url: "/admin/settings", icon: Settings, color: "text-gray-400" },
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0d0d1a]">
      <SidebarContent className="px-2 py-5">
        {/* Branding */}
        <div className={`flex items-center gap-3 mb-8 ${collapsed ? "justify-center px-0" : "px-3"}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-900/40 flex-shrink-0">
            <Zap className="text-white h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-black text-white text-base tracking-tight leading-none">OriginalStore</div>
              <div className="text-[10px] text-blue-400/80 font-semibold tracking-widest uppercase mt-0.5">Admin Panel</div>
            </div>
          )}
        </div>

        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.15em] text-gray-700 font-bold mb-1 px-3">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 text-gray-500 hover:text-gray-200 group"
                        activeClassName="!bg-white/8 !text-white font-semibold"
                      >
                        <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${item.color} opacity-80 group-hover:opacity-100`} />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                        {!collapsed && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{displayName}</div>
              <div className="text-[10px] text-blue-400 font-medium">Administrateur</div>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          asChild
          size="sm" 
          className="w-full justify-start text-gray-600 hover:text-gray-300 hover:bg-white/5 mb-1 rounded-xl"
        >
          <Link to="/">
            <Monitor className="h-4 w-4 mr-2 flex-shrink-0" />
            {!collapsed && "Voir le site"}
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl" 
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
          {!collapsed && "Déconnexion"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
