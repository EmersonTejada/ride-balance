import { z } from "zod";

export const incomesReportParamsSchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser yyyy-mm-dd"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser yyyy-mm-dd"),
});

export type IncomesReportParams = z.infer<typeof incomesReportParamsSchema>;

export interface IncomesReportPeriod {
  from: string;
  to: string;
  days: number;
  timezone: string;
}

export interface IncomesReportKPIs {
  totalRides: number;
  totalIncome: number;
  avgPerRide: number;
}

export interface IncomeByDay {
  date: string;
  amount: number;
}

export interface IncomeByPlatform {
  platform: string;
  amount: number;
  percentage: number;
}

export interface IncomesReportCharts {
  incomeByDay: IncomeByDay[];
  incomeByPlatform: IncomeByPlatform[];
  incomeByPlatformPercentage: { platform: string; percentage: number }[];
}

export interface IncomesReportData {
  period: IncomesReportPeriod;
  kpis: IncomesReportKPIs;
  charts: IncomesReportCharts;
}

export interface IncomesReportResponse {
  message: string;
  data: IncomesReportData;
}