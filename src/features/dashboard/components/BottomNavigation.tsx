import { NavLink, useLocation } from "react-router";
import {
  BanknoteArrowUp,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  User,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useState } from "react";

type LinkItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  submenus?: { to: string; label: string }[];
};

const navigationItems: LinkItem[] = [
  {
    to: "/app",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    end: true,
  },
  {
    to: "incomes",
    label: "Ingresos",
    icon: <BanknoteArrowUp className="h-5 w-5" />,
  },
  {
    to: "expenses",
    label: "Gastos",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    to: "reports",
    label: "Reportes",
    icon: <BarChart3 className="h-5 w-5" />,
    submenus: [
      { to: "reports/summary", label: "Resumen" },
      { to: "reports/incomes", label: "Ingresos" },
      { to: "reports/expenses", label: "Gastos" },
    ],
  },
  {
    to: "profile",
    label: "Perfil",
    icon: <User className="h-5 w-5" />,
  },
];

export const BottomNavigation = () => {
  const [openReports, setOpenReports] = useState(false);
  const location = useLocation();

  const isReportsActive = location.pathname.includes("/app/reports");

  return (
    <div className="md:hidden fixed bottom-0 w-full z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          if (item.submenus) {
            return (
              <Popover
                open={openReports}
                onOpenChange={setOpenReports}
                key={item.to}
              >
                <PopoverTrigger asChild>
                  <button
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                      isReportsActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <div
                      className={
                        isReportsActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs mt-1">{item.label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 mb-2 p-2" sideOffset={8}>
                  <div className="flex flex-col gap-1">
                    {item.submenus.map((subItem) => (
                      <NavLink
                        key={subItem.to}
                        to={subItem.to}
                        onClick={() => setOpenReports(false)}
                        className={({ isActive }) =>
                          `px-4 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-accent text-accent-foreground font-medium"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={
                      isActive ? "text-primary" : "text-muted-foreground"
                    }
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
