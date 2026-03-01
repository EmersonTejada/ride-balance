import { Button } from '@/shared/components/ui/button';

export const Hero = () => {
  return (
    <>
      <section id="hero" className="h-screen flex flex-col justify-center items-center text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl text-balance font-bold mb-4">
            Controla tus ganancias y gastos como conductor de Aplicaciones
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            Ride Balance te muestra tus ingresos diarios, gastos de operación y
            tu rentabilidad real.
          </p>
          <Button size={"lg"}  className="text-md py-6 px-8">Comienza ahora</Button>
        </div>

      </section>
    </>
  );
};
