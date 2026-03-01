import { create } from "zustand";
import type {
  WeeklySummaryData,
  WeeklySummaryResponse,
} from "../types/weekly-summary";
import * as WeeklyDashboardService from "../services/weeklyDashboard.service";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface WeeklyDashboardState {
  data: WeeklySummaryData | null;
  isLoading: boolean;
  error: string | null;

  fetchWeeklySummary: () => Promise<void>;
}

export const useWeeklyDashboardStore = create<WeeklyDashboardState>()(
  (set) => ({
    data: null,
    isLoading: false,
    error: null,

    fetchWeeklySummary: async () => {
      set({ isLoading: true, error: null });
      try {
        const response: WeeklySummaryResponse =
          await WeeklyDashboardService.getWeeklyDashboard();
        console.log(response);
        set({ data: response.data, isLoading: false });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        set({ error: errorMessage, isLoading: false });
      }
    },
  }),
);
