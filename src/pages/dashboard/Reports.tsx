import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useRideStore } from "@/stores/useRideStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Category colors for pie chart
const CATEGORY_COLORS = {
  fuel: "#3b82f6",
  maintenance: "#ef4444",
  food: "#22c55e",
  insurance: "#a855f7",
  parking: "#f59e0b",
  phone: "#ec4899",
  tolls: "#06b6d4",
  other: "#6b7280",
};

// Platform colors for ride chart
const PLATFORM_COLORS = {
  yummy: "#f97316",
  ridery: "#8b5cf6",
  particular: "#14b8a6",
};

type DateRange = {
  from: string;
  to: string;
};

type FilterState = {
  dateRange: DateRange;
  category: string;
  platform: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  activeTab: "overview" | "expenses" | "rides" | "transactions";
};

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2)}`;
};

const formatDate = (dateStr: string | Date) => {
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  return date.toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateShort = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
  });
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    fuel: "Combustible",
    maintenance: "Mantenimiento",
    food: "Comida",
    insurance: "Seguro",
    parking: "Estacionamiento",
    phone: "Teléfono",
    tolls: "Peajes",
    other: "Otro",
  };
  return labels[category] || category;
};

const getPlatformLabel = (platform: string) => {
  const labels: Record<string, string> = {
    yummy: "Yummy",
    ridery: "Ridery",
    particular: "Particular",
  };
  return labels[platform] || platform;
};

export const Reports = () => {
  const { expenses, fetchExpenses, loading: expenseLoading } = useExpenseStore();
  const { rides, fetchRides, loading: rideLoading } = useRideStore();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
    },
    category: "all",
    platform: "all",
    sortBy: "date",
    sortOrder: "desc",
    activeTab: "overview",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchRides();
  }, [fetchExpenses, fetchRides]);

  // Filter and sort data
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        const dateInRange = expenseDate >= fromDate && expenseDate <= toDate;
        const categoryMatch = filters.category === "all" || expense.category === filters.category;
        return dateInRange && categoryMatch;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case "date":
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          default:
            comparison = 0;
        }
        return filters.sortOrder === "asc" ? comparison : -comparison;
      });
  }, [expenses, filters]);

  const filteredRides = useMemo(() => {
    return rides
      .filter((ride) => {
        const rideDate = new Date(ride.date);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        const dateInRange = rideDate >= fromDate && rideDate <= toDate;
        const platformMatch = filters.platform === "all" || ride.platform === filters.platform;
        return dateInRange && platformMatch;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case "date":
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "platform":
            comparison = a.platform.localeCompare(b.platform);
            break;
          default:
            comparison = 0;
        }
        return filters.sortOrder === "asc" ? comparison : -comparison;
      });
  }, [rides, filters]);

  // Calculate metrics
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const totalRides = useMemo(() => {
    return filteredRides.reduce((sum, r) => sum + r.amount, 0);
  }, [filteredRides]);

  const totalSpent = totalExpenses + totalRides;

  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      grouped[expense.category] = (grouped[expense.category] || 0) + expense.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({
      name: getCategoryLabel(name),
      value,
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS],
    }));
  }, [filteredExpenses]);

  const expensesByPlatform = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredRides.forEach((ride) => {
      grouped[ride.platform] = (grouped[ride.platform] || 0) + ride.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({
      name: getPlatformLabel(name),
      value,
      color: PLATFORM_COLORS[name as keyof typeof PLATFORM_COLORS],
    }));
  }, [filteredRides]);

  const expensesByDate = useMemo(() => {
    const grouped: Record<string, { expenses: number; rides: number }> = {};
    const allItems = [
      ...filteredExpenses.map((e) => ({ date: String(e.date), type: "expense", amount: e.amount })),
      ...filteredRides.map((r) => ({ date: String(r.date), type: "ride", amount: r.amount })),
    ];
    allItems.forEach((item) => {
      if (!grouped[item.date]) {
        grouped[item.date] = { expenses: 0, rides: 0 };
      }
      if (item.type === "expense") {
        grouped[item.date].expenses += item.amount;
      } else {
        grouped[item.date].rides += item.amount;
      }
    });
    return Object.entries(grouped)
      .map(([date, data]) => ({
        date: formatDateShort(date),
        fullDate: date,
        expenses: data.expenses,
        rides: data.rides,
        total: data.expenses + data.rides,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [filteredExpenses, filteredRides]);

  const dailyAverage = useMemo(() => {
    const days =
      Math.ceil(
        (new Date(filters.dateRange.to).getTime() - new Date(filters.dateRange.from).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return days > 0 ? totalSpent / days : 0;
  }, [totalSpent, filters.dateRange]);

  const expensesCount = filteredExpenses.length;
  const ridesCount = filteredRides.length;

  // Calculate previous period comparison
  const previousPeriodTotal = useMemo(() => {
    const days =
      Math.ceil(
        (new Date(filters.dateRange.to).getTime() - new Date(filters.dateRange.from).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const prevFrom = new Date(filters.dateRange.from);
    prevFrom.setDate(prevFrom.getDate() - days);
    const prevTo = new Date(filters.dateRange.from);

    const prevExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return date >= prevFrom && date < prevTo;
    });
    const prevRides = rides.filter((r) => {
      const date = new Date(r.date);
      return date >= prevFrom && date < prevTo;
    });

    return (
      prevExpenses.reduce((sum, e) => sum + e.amount, 0) +
      prevRides.reduce((sum, r) => sum + r.amount, 0)
    );
  }, [expenses, rides, filters.dateRange]);

  const percentageChange = previousPeriodTotal > 0 
    ? ((totalSpent - previousPeriodTotal) / previousPeriodTotal) * 100 
    : 0;

  const handleSort = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handleExportCSV = () => {
    const headers = ["Fecha", "Tipo", "Categoría/Plataforma", "Descripción", "Monto"];
    const rows = [
      ...filteredExpenses.map((e) => [
        formatDate(e.date),
        "Gasto",
        getCategoryLabel(e.category),
        e.description || "",
        `-${e.amount.toFixed(2)}`,
      ]),
      ...filteredRides.map((r) => [
        formatDate(r.date),
        "Viaje",
        getPlatformLabel(r.platform),
        "",
        `+${r.amount.toFixed(2)}`,
      ]),
    ];
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reportes_${filters.dateRange.from}_${filters.dateRange.to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-2 md:p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Análisis detallado de tus gastos y viajes
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleExportCSV}
          disabled={expenseLoading || rideLoading}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </div>

      {/* Filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 w-full justify-between sm:w-auto">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Desde</label>
                  <Input
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hasta</label>
                  <Input
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="fuel">Combustible</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="food">Comida</SelectItem>
                      <SelectItem value="insurance">Seguro</SelectItem>
                      <SelectItem value="parking">Estacionamiento</SelectItem>
                      <SelectItem value="phone">Teléfono</SelectItem>
                      <SelectItem value="tolls">Peajes</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plataforma</label>
                  <Select
                    value={filters.platform}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, platform: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las plataformas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las plataformas</SelectItem>
                      <SelectItem value="yummy">Yummy</SelectItem>
                      <SelectItem value="ridery">Ridery</SelectItem>
                      <SelectItem value="particular">Particular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Summary Cards */}
      {(expenseLoading || rideLoading) ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Gastado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
              <div className="flex items-center gap-1 text-xs">
                {percentageChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-500" />
                )}
                <span className={percentageChange >= 0 ? "text-red-500" : "text-green-500"}>
                  {percentageChange >= 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Ganancia Neta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(totalRides - totalExpenses)}
              </div>
              <div className="text-xs text-muted-foreground">
                Ingresos - Gastos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Promedio Diario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dailyAverage)}</div>
              <div className="text-xs text-muted-foreground">
                {expensesCount + ridesCount} transacciones
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gastos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <div className="text-xs text-muted-foreground">{expensesCount} registros</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Viajes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRides)}</div>
              <div className="text-xs text-muted-foreground">{ridesCount} registros</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="rides">Viajes</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendencia de Gastos</CardTitle>
                <CardDescription>Evolución diaria de gastos y viajes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {expensesByDate.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={expensesByDate}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          name="Gastos"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="rides"
                          name="Viajes"
                          stackId="2"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No hay datos para el período seleccionado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
                <CardDescription>Gastos por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No hay gastos en el período seleccionado
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {expensesByCategory.map((category) => (
                    <Badge
                      key={category.name}
                      variant="secondary"
                      className="gap-1"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Plataforma</CardTitle>
                <CardDescription>Ingresos por plataforma de viajes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {expensesByPlatform.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByPlatform}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {expensesByPlatform.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No hay viajes en el período seleccionado
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {expensesByPlatform.map((platform) => (
                    <Badge
                      key={platform.name}
                      variant="secondary"
                      className="gap-1"
                      style={{
                        backgroundColor: `${platform.color}20`,
                        color: platform.color,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      {platform.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Expenses by Category Bar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
                <CardDescription>Comparación de gastos entre categorías</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" name="Monto">
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expenses Line Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendencia de Gastos</CardTitle>
                <CardDescription>Evolución temporal de gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expensesByDate}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Gastos"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Categories Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensesByCategory
                  .sort((a, b) => b.value - a.value)
                  .map((category) => {
                    const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0;
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{formatCurrency(category.value)}</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rides Tab */}
        <TabsContent value="rides" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Rides by Platform Bar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ingresos por Plataforma</CardTitle>
                <CardDescription>Comparación de ingresos entre plataformas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesByPlatform}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" name="Ingresos">
                        {expensesByPlatform.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Rides Line Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendencia de Viajes</CardTitle>
                <CardDescription>Evolución temporal de ingresos por viajes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expensesByDate}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rides"
                        name="Viajes"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensesByPlatform
                  .sort((a, b) => b.value - a.value)
                  .map((platform) => {
                    const percentage = totalRides > 0 ? (platform.value / totalRides) * 100 : 0;
                    return (
                      <div key={platform.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: platform.color }}
                            />
                            <span className="font-medium">{platform.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{formatCurrency(platform.value)}</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: platform.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Transacciones</CardTitle>
              <CardDescription>
                {filteredExpenses.length + filteredRides.length} transacciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Combined Transactions Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center gap-1">
                          Fecha
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("category")}
                      >
                        <div className="flex items-center gap-1">
                          Categoría/Plataforma
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 text-right"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Monto
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Expense transactions */}
                    {filteredExpenses.map((expense) => (
                      <TableRow key={`expense-${expense.id}`}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Gasto</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS]}20`,
                              color: CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS],
                            }}
                          >
                            {getCategoryLabel(expense.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {expense.description || "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-500">
                          -{formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Ride transactions */}
                    {filteredRides.map((ride) => (
                      <TableRow key={`ride-${ride.id}`}>
                        <TableCell>{formatDate(ride.date)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Viaje</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: `${PLATFORM_COLORS[ride.platform as keyof typeof PLATFORM_COLORS]}20`,
                              color: PLATFORM_COLORS[ride.platform as keyof typeof PLATFORM_COLORS],
                            }}
                          >
                            {getPlatformLabel(ride.platform)}
                          </Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-right font-medium text-green-500">
                          +{formatCurrency(ride.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredExpenses.length === 0 && filteredRides.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay transacciones en el período seleccionado
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trip Analysis Section */}
      <Separator />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Análisis de Viajes</h2>
        
        {/* Trip Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Viajes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ridesCount}</div>
              <div className="text-sm text-muted-foreground">
                {filteredRides.length} en el período
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Promedio por Viaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(ridesCount > 0 ? totalRides / ridesCount : 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Ingreso promedio por viaje
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Plataforma Principal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {expensesByPlatform.length > 0
                  ? expensesByPlatform.sort((a, b) => b.value - a.value)[0].name
                  : "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                Mayor ingresos generados
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Breakdown by Date */}
        <Card>
          <CardHeader>
            <CardTitle>Viajes por Día</CardTitle>
            <CardDescription>Desglose de ingresos por fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expensesByDate}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rides" name="Ingresos por Viajes" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
