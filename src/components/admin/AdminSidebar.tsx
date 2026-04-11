import { 
  LayoutDashboard, Package, Video, PlayCircle,
  MessageSquare, ShoppingCart, Settings, LogOut, Monitor, ChevronRight, Zap
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const menuGroups = [
  {
    label: "Principal",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Boutique",
    items: [
      { title: "Produits", url: "/admin/products", icon: Package },
      { title: "Commandes", url: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Contenu",
    items: [
      { title: "TikTok", url: "/admin/tiktok", icon: Video },
      { title: "YouTube", url: "/admin/youtube", icon: PlayCircle },
      { title: "Témoignages", url: "/admin/testimonials", icon: MessageSquare },
    ],
  },
  {
    label: "Système",
    items: [{ title: "Réglages", url: "/admin/settings", icon: Settings }],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Admin";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-100 bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <SidebarContent className="px-3 py-5">
        {/* Logo */}
        <div className={`flex items-center gap-3 mb-8 ${collapsed ? "justify-center" : "px-2"}`}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg, #003366, #0077cc)" }}
          >
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-black text-gray-900 text-sm leading-tight">ChawniLive</div>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Admin Panel</div>
            </div>
          )}
        </div>

        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-3">
            {!collapsed && (
              <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-bold mb-1 px-2">
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group"
                        activeClassName="!bg-blue-50 !text-blue-700 font-semibold"
                      >
                        <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                        {!collapsed && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-30 transition-opacity" />
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

      <SidebarFooter className="p-3 border-t border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-2.5 mb-2 border border-gray-100">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #003366, #0077cc)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-800 truncate">{name}</div>
              <div className="text-[10px] text-blue-600 font-semibold">Administrateur</div>
            </div>
          </div>
        )}
        <Button variant="ghost" asChild size="sm"
          className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-50 mb-1 rounded-xl text-sm">
          <Link to="/"><Monitor className="h-4 w-4 mr-2" />{!collapsed && "Voir le site"}</Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={signOut}
          className="w-full justify-start text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm">
          <LogOut className="h-4 w-4 mr-2" />{!collapsed && "Déconnexion"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
