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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import {
  BanknoteArrowUp,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

export const AppSidebar = () => {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = user?.name || user?.email || "User";

  type LinkItem = {
    to: string;
    label: string;
    icon: React.ReactNode;
    end?: boolean;
    submenus?: { to: string; label: string }[];
  };

  const links: LinkItem[] = [
    {
      to: "/app",
      label: "Dashboard",
      icon: <LayoutDashboard />,
      end: true,
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
      to: "reservations",
      label: "Reservas",
      icon: <Calendar />,
    },
    {
      to: "reports",
      label: "Reportes",
      icon: <BarChart3 />,
      submenus: [
        { to: "reports/summary", label: "Resumen" },
        { to: "reports/incomes", label: "Ingresos" },
        { to: "reports/expenses", label: "Gastos" },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              RB
            </span>
          </div>
          <span className="font-semibold text-lg">Ride Balance</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link) =>
              link.submenus ? (
                <Collapsible
                  key={link.label}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={link.label}>
                        {link.icon}
                        <span>{link.label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {link.submenus.map((sub) => (
                          <SidebarMenuSubItem key={sub.label}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={sub.to}
                                className={({ isActive }) =>
                                  isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                    : ""
                                }
                              >
                                <span>{sub.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={link.label}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    children={({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        tooltip={link.label}
                        data-active={isActive ? "true" : undefined}
                      >
                        <div>
                          {link.icon}
                          <span>{link.label}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  />
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link
          to="profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage alt={displayName} />
            <AvatarFallback className="text-xs">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">Ver perfil</span>
          </div>
        </Link>
        <Button
          onClick={signOut}
          className="bg-sidebar-foreground cursor-pointer"
        >
          Cerrar Sesion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
