import type {
  IncomesReportParams,
  IncomesReportResponse,
} from "@/features/reports/schemas/incomes.schema";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

interface NestJSIncomesResponse {
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
    incomeByPlatform: { platform: string; amount: number }[];
    incomeByPlatformPercentage: { platform: string; percentage: number }[];
  };
}

export const getIncomesReport = async (
  params: IncomesReportParams,
): Promise<IncomesReportResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      timezone: timezone,
    };

    const response = await fetch(`${API_URL}/reports/rides?${query.toString()}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching incomes report");
    }

    const rawData: NestJSIncomesResponse = await response.json();

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
        totalRides: rawData.kpis.totalRides,
        totalIncome: rawData.kpis.totalIncome,
        avgPerRide: rawData.kpis.avgPerRide,
      },
      charts: {
        incomeByDay: rawData.charts.incomeByDay,
        incomeByPlatform: rawData.charts.incomeByPlatform.map((item) => {
          const percentageItem = rawData.charts.incomeByPlatformPercentage.find(
            (p) => p.platform === item.platform,
          );
          return {
            platform: item.platform,
            amount: item.amount,
            percentage: percentageItem?.percentage ?? 0,
          };
        }),
        incomeByPlatformPercentage: rawData.charts.incomeByPlatformPercentage,
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