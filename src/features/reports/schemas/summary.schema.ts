import { z } from "zod";

export const summaryReportParamsSchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser yyyy-mm-dd"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser yyyy-mm-dd"),
});

export type SummaryReportParams = z.infer<typeof summaryReportParamsSchema>;

export interface SummaryReportResponse {
  message: string;
  data: {
    period: {
      from: string; // ISO string 2026-03-02T00:00:00
      to: string; // ISO string
      days: number;
      timezone: string;
    };
    kpis: {
      totalIncome: string;
      totalExpenses: string;
      totalRides: number;
      netIncome: string;
      avgIncomePerRide: string;
    };
    charts: {
      incomeByDay: {
        date: string; // yyyy-mm-dd
        amount: string;
      }[];
      expensesByCategory: {
        category: string;
        amount: string;
      }[];
      expensesByCategoryPercentage: {
        category: string;
        percentage: string;
      }[];
      incomeByPlatformPercentage: {
        platform: string;
        percentage: string;
      }[];
    };
  };
}
