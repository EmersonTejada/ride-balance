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

export interface WeeklyCharts {
  incomeByDay: ChartDataPoint[];
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
