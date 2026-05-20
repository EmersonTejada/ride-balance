import type { WeeklySummaryData } from "../types/weekly-summary";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

interface NestJSWeeklyResponse {
  period: {
    from: string;
    to: string;
    timezone: string;
  };
  kpis: {
    totalRides: number;
    totalRidesAmount: number;
    totalExpenses: number;
    totalExpensesAmount: number;
    net: number;
    avgPerRide: number;
  };
  charts: {
    incomeByDay: { date: string; amount: number }[];
  };
}

export const getWeeklyDashboard = async (): Promise<{
  message: string;
  data: WeeklySummaryData;
}> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`${API_URL}/reports/weekly`, {
      method: "GET",
      headers: {
        timezone: timezone,
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data: NestJSWeeklyResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.period ? (data as any).message : "Error fetching weekly dashboard");
    }

    // Map NestJS flat response to frontend envelope
    const adaptedData: WeeklySummaryData = {
      period: {
        from: data.period.from,
        to: data.period.to,
        timezone: data.period.timezone,
      },
      kpis: {
        totalIncome: String(data.kpis.totalRidesAmount),
        totalExpenses: String(data.kpis.totalExpensesAmount),
        totalRides: data.kpis.totalRides,
        netIncome: String(data.kpis.net),
        avgIncomePerRide: String(data.kpis.avgPerRide),
      },
      charts: {
        incomeByDay: data.charts.incomeByDay.map((point) => ({
          date: point.date,
          amount: String(point.amount),
        })),
      },
    };

    return {
      message: "success",
      data: adaptedData,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
