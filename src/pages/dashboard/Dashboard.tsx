import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownRight, Calendar, Fuel, Wrench, Car } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, LabelList, PieChart, Pie, Cell } from "recharts";

// Mock data - replace with real data from Supabase later
const earningsData = [
  { month: "Enero", earnings: 2400 },
  { month: "Feb", earnings: 1398 },
  { month: "Mar", earnings: 9800 },
  { month: "Abr", earnings: 3908 },
  { month: "May", earnings: 4800 },
  { month: "Jun", earnings: 3800 },
];

const chartConfig = {
  earnings: {
    label: "Ganancias",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Gastos",
    color: "var(--chart-2)",
  },
  gasolina: {
    label: "Gasolina",
    color: "var(--chart-1)",
  },
  mantenimiento: {
    label: "Mantenimiento",
    color: "var(--chart-2)",
  },
  repuestos: {
    label: "Repuestos",
    color: "var(--chart-3)",
  },
  otros: {
    label: "Otros",
    color: "var(--chart-4)",
  },
};

// Mock recent transactions
const recentTransactions = [
  {
    id: 1,
    type: "income",
    description: "Viaje aeropuerto",
    amount: 450,
    date: "2024-11-26",
    category: "Ingreso"
  },
  {
    id: 2,
    type: "expense",
    description: "Gasolina Estación Central",
    amount: -120,
    date: "2024-11-25",
    category: "Gasolina"
  },
  {
    id: 3,
    type: "income",
    description: "Servicio nocturno",
    amount: 380,
    date: "2024-11-25",
    category: "Ingreso"
  },
  {
    id: 4,
    type: "expense",
    description: "Cambio de aceite",
    amount: -85,
    date: "2024-11-24",
    category: "Mantenimiento"
  },
  {
    id: 5,
    type: "expense",
    description: "Frenos delanteros",
    amount: -250,
    date: "2024-11-23",
    category: "Repuestos"
  },
];

// Mock expense breakdown data
const expenseData = [
  { name: "Gasolina", value: 450, color: "var(--chart-1)" },
  { name: "Mantenimiento", value: 320, color: "var(--chart-2)" },
  { name: "Repuestos", value: 680, color: "var(--chart-3)" },
  { name: "Otros", value: 180, color: "var(--chart-4)" },
];

const stats = [
  {
    title: "Ganancias del Mes",
    value: "4,250",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Gastos del Mes",
    value: "1,890",
    change: "+8.2%",
    changeType: "negative",
    icon: Wallet,
  },
  {
    title: "Ganancia Neta",
    value: "2,360",
    change: "+15.3%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "Balance Total",
    value: "12,450",
    change: "+5.4%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

export const Dashboard = () => {
  const loading = false; // Set to true to see loading states

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control de ganancias y gastos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}$</div>
              <p className={`text-xs flex items-center ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-destructive"
              }`}>
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Análisis de Datos</h2>
        <Select defaultValue="6months">
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Últimos 7 días</SelectItem>
            <SelectItem value="30days">Últimos 30 días</SelectItem>
            <SelectItem value="3months">Últimos 3 meses</SelectItem>
            <SelectItem value="6months">Últimos 6 meses</SelectItem>
            <SelectItem value="1year">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ganancias de los Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full aspect-auto">
              <BarChart data={earningsData} accessibilityLayer margin={{
                top: 20,
              }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel  />}
                />
                <Bar
                  dataKey="earnings"
                  fill="var(--color-earnings)"
                  radius={8}
                >
                  <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground font-bold"
                  fontSize={12}
                  formatter={(value: number) => `${value}$`}
                />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full !aspect-auto">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => [`$${value}`, ""]} />}
                />
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ingreso
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Gasto
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Fuel className="h-4 w-4 mr-2" />
                Registrar Combustible
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Mantenimiento
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Repuestos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};