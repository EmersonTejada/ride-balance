import { useRideStore } from "@/stores/useRideStore";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSignIcon, TrendingUpIcon, CalendarIcon, MinusIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export const Dashboard = () => {
  const rides = useRideStore((state) => state.rides);
  const fetchRides = useRideStore((state) => state.fetchRides);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const { metrics, chartData, latestRides } = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalWeek = rides
      .filter((ride) => new Date(ride.date) >= startOfWeek)
      .reduce((sum, ride) => sum + ride.amount, 0);

    const totalMonth = rides
      .filter((ride) => new Date(ride.date) >= startOfMonth)
      .reduce((sum, ride) => sum + ride.amount, 0);

    const totalAll = rides.reduce((sum, ride) => sum + ride.amount, 0);

    // Placeholder for expenses
    const expensesWeek = 0;
    const expensesMonth = 0;
    const expensesAll = 0;

    const metrics = {
      incomeWeek: totalWeek,
      incomeMonth: totalMonth,
      incomeAll: totalAll,
      expensesWeek,
      expensesMonth,
      expensesAll,
      netWeek: totalWeek - expensesWeek,
      netMonth: totalMonth - expensesMonth,
      netAll: totalAll - expensesAll,
    };

    // Chart data for last 7 days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      const dayTotal = rides
        .filter((ride) => {
          const rideDate = new Date(ride.date);
          return rideDate >= dayStart && rideDate <= dayEnd;
        })
        .reduce((sum, ride) => sum + ride.amount, 0);
      chartData.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        amount: dayTotal,
      });
    }

    // Latest rides
    const latestRides = rides
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return { metrics, chartData, latestRides };
  }, [rides]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Esta Semana</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.incomeWeek.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Este Mes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.incomeMonth.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.incomeAll.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Esta Semana</CardTitle>
            <MinusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.expensesWeek.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Próximamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Este Mes</CardTitle>
            <MinusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.expensesMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Próximamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.netAll.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Ingresos de los Últimos 7 Días</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              amount: {
                label: "Ingresos",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px] w-full"
          >
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="var(--color-amount)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Latest Rides */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Viajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {latestRides.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay viajes</p>
            ) : (
              latestRides.map((ride) => (
                <div key={ride.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium capitalize">{ride.platform}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ride.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-bold">${ride.amount.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Latest Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Próximamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};