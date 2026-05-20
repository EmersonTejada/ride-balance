import { useEffect, useState } from "react";
import { format, parseISO, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { useSummaryReportStore } from "../stores/useSummaryReportStore";
import { summaryReportParamsSchema } from "../schemas/summary.schema";
import { ChartBarLabel } from "@/features/weekly-summary/components/BarChart";
import { DonutChart } from "@/shared/components/charts/DonutChart";
import { PlatformBarChart } from "@/shared/components/charts/PlatformBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const SummaryReport = () => {
  const today = new Date();
  const defaultFrom = format(subDays(today, 30), "yyyy-MM-dd");
  const defaultTo = format(today, "yyyy-MM-dd");

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [dateError, setDateError] = useState<string | null>(null);

  const { data, isLoading, error, fetchSummaryReport } = useSummaryReportStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);

    const validation = summaryReportParamsSchema.safeParse({ from, to });
    if (!validation.success) {
      setDateError(validation.error.issues[0]?.message || "Fechas inválidas");
      return;
    }

    if (new Date(from) > new Date(to)) {
      setDateError("La fecha inicial no puede ser mayor que la final");
      return;
    }

    fetchSummaryReport({ from, to });
  };

  useEffect(() => {
    fetchSummaryReport({ from: defaultFrom, to: defaultTo });
  }, []);

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resumen General</h1>
        <p className="text-muted-foreground">
          Overview de tus ingresos y gastos en el período seleccionado
        </p>
      </div>

      {/* Date Range Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Período</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="from" className="text-sm font-medium">
                Desde
              </label>
              <input
                id="from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="to" className="text-sm font-medium">
                Hasta
              </label>
              <input
                id="to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Consultar
            </button>
          </form>
          {dateError && (
            <p className="text-sm text-red-500 mt-2">{dateError}</p>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[350px] w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Data Display */}
      {data && !isLoading && (
        <>
          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Viajes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.kpis.totalRides.toLocaleString("es-AR")}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.kpis.totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(data.kpis.totalExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingreso Neto</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    parseFloat(data.kpis.netIncome) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(data.kpis.netIncome)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Promedio por Viaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.kpis.avgIncomePerRide)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Period Info */}
          <div className="text-sm text-muted-foreground">
            Período:{" "}
            {format(parseISO(data.period.from), "dd MMM yyyy", { locale: es })} -{" "}
            {format(parseISO(data.period.to), "dd MMM yyyy", { locale: es })} (
            {data.period.days} días)
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Income by Day */}
            <ChartBarLabel
              chartData={data.charts.incomeByDay.map((item) => ({
                date: item.date,
                amount: String(item.amount),
              }))}
            />

            {/* Expenses by Category */}
            <DonutChart
              data={data.charts.expensesByCategoryPercentage.map((item) => ({
                category: item.category,
                percentage: parseFloat(item.percentage),
              }))}
              title="Gastos por Categoría"
              description="Distribución porcentual"
            />

            {/* Income by Platform */}
            <PlatformBarChart
              data={data.charts.incomeByPlatformPercentage.map((item) => ({
                platform: item.platform,
                amount: 0,
                percentage: parseFloat(item.percentage),
              }))}
              title="Ingresos por Plataforma"
              description="Distribución porcentual"
            />
          </div>
        </>
      )}

      {/* Empty State */}
      {data && !isLoading && data.kpis.totalRides === 0 && (
        <Card>
          <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
            No hay datos para el período seleccionado
          </CardContent>
        </Card>
      )}
    </div>
  );
};