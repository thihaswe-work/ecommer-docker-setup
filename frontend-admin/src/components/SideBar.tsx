import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, ShoppingCart, Package, Settings } from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: Home }, // Home icon → Dashboard
  { title: "Users", url: "/users", icon: Users }, // Users icon → Users
  { title: "Orders", url: "/orders", icon: ShoppingCart }, // ShoppingCart → Orders
  { title: "Products", url: "/products", icon: Package }, // Package → Products
  { title: "Settings", url: "/settings", icon: Settings }, // Settings → Settings
];
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {/* SidebarMenuButton automatically handles collapsed state */}
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="sidebar-text">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{/* Optional footer content */}</SidebarFooter>
    </Sidebar>
  );
}
