import { z } from "zod";

export const expensesReportParamsSchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser yyyy-mm-dd"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser yyyy-mm-dd"),
});

export type ExpensesReportParams = z.infer<typeof expensesReportParamsSchema>;

export interface ExpensesReportPeriod {
  from: string;
  to: string;
  days: number;
  timezone: string;
}

export interface ExpensesReportKPIs {
  totalExpenses: number;
  totalAmount: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

export interface ExpensesReportCharts {
  expensesByCategory: ExpenseByCategory[];
  expensesByCategoryPercentage: { category: string; percentage: number }[];
}

export interface ExpensesReportData {
  period: ExpensesReportPeriod;
  kpis: ExpensesReportKPIs;
  charts: ExpensesReportCharts;
}

export interface ExpensesReportResponse {
  message: string;
  data: ExpensesReportData;
}