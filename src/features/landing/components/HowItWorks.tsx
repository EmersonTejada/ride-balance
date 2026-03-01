import { Smartphone, Calculator, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "1. Registra tu jornada",
      description:
        "Anota rápidamente las ganancias obtenidas en tus diferentes apps de transporte.",
      icon: <Smartphone className="h-8 w-8 text-primary" />,
    },
    {
      title: "2. Añade tus gastos",
      description:
        "Introduce en segundos lo que gastaste en combustible, peajes o comidas.",
      icon: <Calculator className="h-8 w-8 text-primary" />,
    },
    {
      title: "3. Obtén tu balance",
      description:
        "Ride Balance calcula automáticamente tus horas y el dinero real que llevas a casa.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Es así de sencillo tomar el control y dejar de adivinar si tus horas
            al volante están rindiendo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] border-t-2 border-dashed border-muted-foreground/30 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 shadow-sm z-10 transition-transform hover:scale-105 duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
