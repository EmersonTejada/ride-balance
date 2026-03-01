import { TrendingUp, Wallet, PieChart, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const Features = () => {
  const features = [
    {
      title: "Control de Ingresos",
      description:
        "Registra cada viaje y conoce exactamente cuánto estás generando día a día en la plataforma.",
      icon: <Wallet className="h-6 w-6 text-primary" />,
    },
    {
      title: "Gestión de Gastos",
      description:
        "Gasolina, mantenimiento, comidas. Anota tus gastos para ver tu rentabilidad real y no solo la facturación.",
      icon: <PieChart className="h-6 w-6 text-primary" />,
    },
    {
      title: "Estadísticas y Reportes",
      description:
        "Visualiza de forma clara cuáles son los días más rentables y mejora tu estrategia en la calle.",
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
    },
    {
      title: "Seguro y Privado",
      description:
        "Tus datos financieros son solo tuyos. Usamos tecnología segura para mantener tu información a salvo.",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Todo lo que necesitas para maximizar tus ganancias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Herramientas pensadas específicamente para conductores de
            aplicaciones que desean tomar el control de sus finanzas y trabajar
            de manera más inteligente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-lg transition-shadow bg-background/60 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
