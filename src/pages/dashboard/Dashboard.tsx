import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/stores/useRideStore";
import { useExpenseStore } from "@/stores/useExpenseStore";
import {
  BanknoteArrowUpIcon,
  TrendingUpIcon,
  ReceiptIcon,
  CarIcon,
  BanknoteArrowDownIcon,
  Wallet,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";



// Helper to get start of week
const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Helper to get start of month
const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Helper to filter rides/expenses by date range
const filterByDateRange = <T extends { date: Date | string }>(
  items: T[],
  startDate: Date
) => {
  return items.filter((item) => new Date(item.date) >= startDate);
};

export const Dashboard = () => {
  const rides = useRideStore((state) => state.rides);
  const fetchRides = useRideStore((state) => state.fetchRides);
  const ridesLoading = useRideStore((state) => state.loading);
  const expenses = useExpenseStore((state) => state.expenses);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const expensesLoading = useExpenseStore((state) => state.loading);

  const loading = ridesLoading || expensesLoading;

  useEffect(() => {
    fetchRides();
    fetchExpenses();
  }, [fetchRides, fetchExpenses]);

  // Calculate totals
  const startOfWeek = getStartOfWeek();
  const startOfMonth = getStartOfMonth();

  // Weekly totals
  const weeklyRides = filterByDateRange(rides, startOfWeek);
  const weeklyIncome = weeklyRides.reduce((sum, ride) => sum + ride.amount, 0);

  // Monthly totals
  const monthlyRides = filterByDateRange(rides, startOfMonth);
  const monthlyIncome = monthlyRides.reduce((sum, ride) => sum + ride.amount, 0);

  // Weekly expenses
  const weeklyExpenses = filterByDateRange(expenses, startOfWeek);
  const weeklyExpenseTotal = weeklyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Weekly net
  const weeklyNet = weeklyIncome - weeklyExpenseTotal;

  // Last 5 records
  const last5Expenses = expenses
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 5);

  const last5Rides = rides
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format date helper
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-2 md:p-4 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - 4 Cards (2x2 on desktop) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weekly Total */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Semana
              </CardTitle>
              <Button size="icon-lg" className="rounded-full bg-green-600 hover:bg-green-700">
                <BanknoteArrowUpIcon className="md:size-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className="text-3xl font-bold">{weeklyIncome.toFixed(2)}$</span>
              )}
            </CardContent>
          </Card>

          {/* Monthly Total */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Mes
              </CardTitle>
              <Button size="icon-lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                <TrendingUpIcon className="md:size-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className="text-3xl font-bold">{monthlyIncome.toFixed(2)}$</span>
              )}
            </CardContent>
          </Card>

          {/* Weekly Expense */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gasto Semana
              </CardTitle>
              <Button size="icon-lg" className="rounded-full bg-destructive ">
                <BanknoteArrowDownIcon className="md:size-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className="text-3xl font-bold text-destructive">
                  -{weeklyExpenseTotal.toFixed(2)}$
                </span>
              )}
            </CardContent>
          </Card>

          {/* Weekly Net */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Neto Semana
              </CardTitle>
              <Button
                size="icon-lg"
                className={`rounded-full ${weeklyNet >= 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-600 hover:bg-orange-700"}`}
              >
                <Wallet className="md:size-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className={`text-3xl font-bold ${weeklyNet >= 0 ? "text-emerald-600" : "text-orange-600"}`}>
                  {weeklyNet.toFixed(2)}$
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 2 Cards (stacked) */}
        <div className="lg:col-span-1 flex flex-col gap-4 items-start">
          {/* Last 5 Expenses */}
          <Card className="flex-1 w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptIcon className="size-5" />
                Últimos 5 Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : last5Expenses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay gastos registrados
                </p>
              ) : (
                <ul className="space-y-3">
                  {last5Expenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(expense.date)}
                        </p>
                      </div>
                      <span className="font-bold text-destructive">
                        -{expense.amount.toFixed(2)}$
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Last 5 Rides */}
          <Card className="flex-1 w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="size-5" />
                Últimos 5 Viajes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : last5Rides.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay viajes registrados
                </p>
              ) : (
                <ul className="space-y-3">
                  {last5Rides.map((ride) => (
                    <li
                      key={ride.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium capitalize">{ride.platform}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(ride.date)}
                        </p>
                      </div>
                      <span className="font-bold text-green-600">
                        +{ride.amount.toFixed(2)}$
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
