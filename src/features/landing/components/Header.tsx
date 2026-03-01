import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Car } from "lucide-react";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-bold text-2xl tracking-tight hidden sm:block">
            Ride Balance
          </h2>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 mr-4 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Características
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              Cómo funciona
            </a>
          </nav>
          <Link to="/app">
            <Button className="rounded-full shadow-sm hover:shadow-md transition-all font-semibold px-6">
              {user ? "Ir al Dashboard" : "Ingresar"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
