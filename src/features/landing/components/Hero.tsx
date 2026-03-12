import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-20"
    >
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight font-extrabold mb-6 max-w-5xl text-balance leading-tight">
          Controla tus{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
            ganancias
          </span>{" "}
          y gastos al volante
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl text-balance leading-relaxed">
          Ride Balance te muestra tus ingresos diarios, costos logísticos de
          operación y tu verdadera rentabilidad real por hora.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/app" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full text-md py-7 px-9 rounded-full font-semibold shadow-xl shadow-primary/25 hover:scale-105 transition-all group"
            >
              Comienza gratis
            </Button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full text-md py-7 px-8 rounded-full font-semibold"
            >
              Ver cómo funciona
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
