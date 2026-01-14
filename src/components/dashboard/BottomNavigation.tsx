import { NavLink } from "react-router";
import { BanknoteArrowUp, LayoutDashboard, CreditCard, BarChart3, User } from "lucide-react";

const navigationItems = [
  {
    to: "/app",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    end: true
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
  },
  {
    to: "profile",
    label: "Perfil",
    icon: <User className="h-5 w-5" />,
  },
];

export const BottomNavigation = () => {
  return (
    <div className="md:hidden fixed bottom-0 w-full z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => (
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
                <div className={isActive ? "text-primary" : "text-muted-foreground"}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};