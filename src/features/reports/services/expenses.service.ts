import type {
  ExpensesReportParams,
  ExpensesReportResponse,
} from "@/features/reports/schemas/expenses-report.schema";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

interface NestJSExpensesResponse {
  period: {
    from: string;
    to: string;
    timezone: string;
  };
  kpis: {
    totalExpenses: number;
    totalAmount: number;
  };
  charts: {
    expensesByCategory: { category: string; amount: number }[];
    expensesByCategoryPercentage: { category: string; percentage: number }[];
  };
}

export const getExpensesReport = async (
  params: ExpensesReportParams,
): Promise<ExpensesReportResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      timezone: timezone,
    };

    const response = await fetch(
      `${API_URL}/reports/expenses?${query.toString()}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching expenses report");
    }

    const rawData: NestJSExpensesResponse = await response.json();

    // Transform NestJS response to frontend format
    const transformedData = {
      period: {
        from: rawData.period.from,
        to: rawData.period.to,
        days: Math.ceil(
          (new Date(rawData.period.to).getTime() -
            new Date(rawData.period.from).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
        timezone: rawData.period.timezone,
      },
      kpis: {
        totalExpenses: rawData.kpis.totalExpenses,
        totalAmount: rawData.kpis.totalAmount,
      },
      charts: {
        expensesByCategory: rawData.charts.expensesByCategory,
        expensesByCategoryPercentage:
          rawData.charts.expensesByCategoryPercentage,
      },
    };

    return {
      message: "success",
      data: transformedData,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};