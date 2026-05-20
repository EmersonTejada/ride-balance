import type {
  SummaryReportParams,
  SummaryReportResponse,
} from "@/features/reports/schemas/summary.schema";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

interface NestJSRidesResponse {
  period: {
    from: string;
    to: string;
    timezone: string;
  };
  kpis: {
    totalRides: number;
    totalIncome: number;
    avgPerRide: number;
  };
  charts: {
    incomeByDay: { date: string; amount: number }[];
    incomeByPlatformPercentage: { platform: string; percentage: number }[];
  };
}

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

export const getSummaryReport = async (
  params: SummaryReportParams,
): Promise<SummaryReportResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      timezone: timezone,
    };

    // Parallel fetch to both endpoints
    const [ridesResponse, expensesResponse] = await Promise.all([
      fetch(`${API_URL}/reports/rides?${query.toString()}`, {
        method: "GET",
        headers,
      }),
      fetch(`${API_URL}/reports/expenses?${query.toString()}`, {
        method: "GET",
        headers,
      }),
    ]);

    if (!ridesResponse.ok) {
      const error = await ridesResponse.json();
      throw new Error(error.message || "Error fetching rides report");
    }

    if (!expensesResponse.ok) {
      const error = await expensesResponse.json();
      throw new Error(error.message || "Error fetching expenses report");
    }

    const ridesData: NestJSRidesResponse = await ridesResponse.json();
    const expensesData: NestJSExpensesResponse = await expensesResponse.json();

    // Merge responses into the expected shape
    const mergedData = {
      period: {
        from: ridesData.period.from,
        to: ridesData.period.to,
        days: Math.ceil(
          (new Date(ridesData.period.to).getTime() -
            new Date(ridesData.period.from).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
        timezone: ridesData.period.timezone,
      },
      kpis: {
        totalIncome: String(ridesData.kpis.totalIncome),
        totalExpenses: String(expensesData.kpis.totalAmount),
        totalRides: ridesData.kpis.totalRides,
        netIncome: String(
          ridesData.kpis.totalIncome - expensesData.kpis.totalAmount,
        ),
        avgIncomePerRide: String(ridesData.kpis.avgPerRide),
      },
      charts: {
        incomeByDay: ridesData.charts.incomeByDay.map((point) => ({
          date: point.date,
          amount: String(point.amount),
        })),
        expensesByCategory: expensesData.charts.expensesByCategory.map(
          (item) => ({
            category: item.category,
            amount: String(item.amount),
          }),
        ),
        expensesByCategoryPercentage:
          expensesData.charts.expensesByCategoryPercentage.map((item) => ({
            category: item.category,
            percentage: String(item.percentage),
          })),
        incomeByPlatformPercentage:
          ridesData.charts.incomeByPlatformPercentage.map((item) => ({
            platform: item.platform,
            percentage: String(item.percentage),
          })),
      },
    };

    return {
      message: "success",
      data: mergedData,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
