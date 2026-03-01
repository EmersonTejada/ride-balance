import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";

export const CTA = () => {
  return (
    <section id="cta" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
          Deja de adivinar, empieza a gestionar
        </h2>
        <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto text-balance">
          Únete a la comunidad de conductores que ya conocen su verdadera
          ganancia por hora y están optimizando cada kilómetro recorrido.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/app">
            <Button
              size="lg"
              variant="secondary"
              className="text-md py-6 px-10 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
            >
              Crea tu cuenta gratis
            </Button>
          </Link>
          <a href="#features">
            <Button
              size="lg"
              variant="link"
              className="text-primary-foreground/80 hover:text-primary-foreground text-md py-6 px-8"
            >
              Conocer más
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
