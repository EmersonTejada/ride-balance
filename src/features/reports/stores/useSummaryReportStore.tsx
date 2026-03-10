import { create } from "zustand";
import type {
  SummaryReportParams,
  SummaryReportResponse,
} from "../schemas/summary.schema";
import * as SummaryService from "../services/summary.service";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface SummaryReportState {
  data: SummaryReportResponse["data"] | null;
  isLoading: boolean;
  error: string | null;

  fetchSummaryReport: (params: SummaryReportParams) => Promise<void>;
  resetStore: () => void;
}

export const useSummaryReportStore = create<SummaryReportState>()((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchSummaryReport: async (params: SummaryReportParams) => {
    set({ isLoading: true, error: null });
    try {
      const response: SummaryReportResponse =
        await SummaryService.getSummaryReport(params);
      set({ data: response.data, isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  resetStore: () => {
    set({ data: null, isLoading: false, error: null });
  },
}));
