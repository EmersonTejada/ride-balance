export interface WeeklyPeriod {
  from: string;
  to: string;
  days?: number;
  timezone: string;
}

export interface WeeklyKPIs {
  totalIncome: string;
  totalExpenses: string;
  totalRides: number;
  netIncome: string;
  avgIncomePerRide: string;
}

export interface ChartDataPoint {
  date: string;
  amount: string;
}

export interface ExpenseCategoryPercentage {
  category: string;
  percentage: number;
}

export interface IncomeByPlatform {
  platform: string;
  amount: number;
}

export interface IncomeByPlatformPercentage {
  platform: string;
  percentage: number;
}

export interface WeeklyCharts {
  incomeByDay: ChartDataPoint[];
  expensesByCategoryPercentage: ExpenseCategoryPercentage[];
  incomeByPlatform: IncomeByPlatform[];
  incomeByPlatformPercentage: IncomeByPlatformPercentage[];
}

export interface WeeklySummaryData {
  period: WeeklyPeriod;
  kpis: WeeklyKPIs;
  charts: WeeklyCharts;
}

export interface WeeklySummaryResponse {
  message: string;
  data: WeeklySummaryData;
}
