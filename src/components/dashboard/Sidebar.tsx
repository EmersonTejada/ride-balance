import { Link, NavLink } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { BanknoteArrowUp, LayoutDashboard, CreditCard, BarChart3, User } from "lucide-react";

export const AppSidebar = () => {
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';

  const links = [
    {
      to: "/app",
      label: "Dashboard",
      icon: <LayoutDashboard />,
      end: true
    },
    {
      to: "incomes",
      label: "Ingresos",
      icon: <BanknoteArrowUp />,
    },
    {
      to: "expenses",
      label: "Gastos",
      icon: <CreditCard />,
    },
    {
      to: "reports",
      label: "Reportes",
      icon: <BarChart3 />,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">RB</span>
          </div>
          <span className="font-semibold text-lg">Ride Balance</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  children={({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      data-active={isActive ? "true" : undefined}
                      
                    >
                      <div className="flex items-center gap-2">
                        {link.icon}
                        {link.label}
                      </div>
                    </SidebarMenuButton>
                  )}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link to="profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt={displayName} />
            <AvatarFallback className="text-xs">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">Ver perfil</span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
};
