import { 
  LayoutDashboard, 
  Package, 
  Video, 
  PlayCircle, 
  MessageSquare, 
  ShoppingCart, 
  Settings, 
  LogOut,
  ChevronRight,
  Monitor
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
    label: "Général",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    label: "Boutique",
    items: [
      { title: "Produits", url: "/admin/products", icon: Package },
      { title: "Commandes", url: "/admin/orders", icon: ShoppingCart },
    ]
  },
  {
    label: "Contenu",
    items: [
      { title: "Vidéos TikTok", url: "/admin/tiktok", icon: Video },
      { title: "Vidéos YouTube", url: "/admin/youtube", icon: PlayCircle },
      { title: "Témoignages", url: "/admin/testimonials", icon: MessageSquare },
    ]
  },
  {
    label: "Système",
    items: [
      { title: "Réglages", url: "/admin/settings", icon: Settings },
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-[#1e1e2d] text-gray-300">
      <SidebarContent className="px-2 py-4">
        {/* Branding */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">OriginalStore</span>
          </div>
        )}

        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-4">
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 px-4">
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
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 group"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                        {!collapsed && item.url === window.location.pathname && (
                           <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
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

      <SidebarFooter className="p-4 border-t border-white/5 mt-auto">
        <Button 
          variant="ghost" 
          asChild
          size="sm" 
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 mb-2"
        >
          <Link to="/">
            <Monitor className="h-4 w-4 mr-2" />
            {!collapsed && "Voir le site"}
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-destructive hover:bg-destructive/10" 
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Déconnexion"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
