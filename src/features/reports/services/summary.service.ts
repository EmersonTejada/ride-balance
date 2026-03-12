import type {
  SummaryReportParams,
  SummaryReportResponse,
} from "@/features/reports/schemas/summary.schema";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

export const getSummaryReport = async (
  params: SummaryReportParams,
): Promise<SummaryReportResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);

    const response = await fetch(
      `${API_URL}/reports/summary?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener el reporte de resumen");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
