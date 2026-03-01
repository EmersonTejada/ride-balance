import { useEffect } from "react";
import { useWeeklyDashboardStore } from "../stores/useWeeklyDashboardStore";
import { ChartBarLabel } from "../components/BarChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { DollarSign, Wallet, TrendingUp, Activity, Car } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const WeeklySummary = () => {
  const data = useWeeklyDashboardStore((state) => state.data);
  const isLoading = useWeeklyDashboardStore((state) => state.isLoading);
  const error = useWeeklyDashboardStore((state) => state.error);
  const fetchWeeklySummary = useWeeklyDashboardStore(
    (state) => state.fetchWeeklySummary,
  );

  useEffect(() => {
    fetchWeeklySummary();
  }, [fetchWeeklySummary]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Semanal</h1>
        <p className="text-muted-foreground">
          Resumen de tu actividad y ganancias para la semana.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <ChartBarLabel chartData={data.charts.incomeByDay || []} />
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="gap-1 lg:gap-6 col-span-2 md:col-span-2 lg:col-span-1 flex flex-col justify-center text-center lg:text-left">
          <CardHeader className="flex flex-col lg:flex-row items-center justify-between pb-0 lg:pb-2">
            <CardTitle className="text-md lg:text-sm font-medium">
              Ingresos
              <br className="hidden lg:block" />
              <span className="lg:hidden"> Totales</span>
              <span className="hidden lg:block">Totales</span>
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground hidden lg:block" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-2xl font-bold">
              {data.kpis.totalIncome}$
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos
              <br />
              Totales
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.totalExpenses}$</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ingreso
              <br />
              Neto
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.netIncome}$</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total
              <br />
              Viajes
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.totalRides}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio
              <br />
              por Viaje
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.kpis.avgIncomePerRide}$
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
