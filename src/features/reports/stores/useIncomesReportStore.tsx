import { create } from "zustand";
import type {
  IncomesReportParams,
  IncomesReportResponse,
} from "@/features/reports/schemas/incomes.schema";
import * as IncomesService from "../services/incomes.service";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface IncomesReportState {
  data: IncomesReportResponse["data"] | null;
  isLoading: boolean;
  error: string | null;

  fetchIncomesReport: (params: IncomesReportParams) => Promise<void>;
  resetStore: () => void;
}

export const useIncomesReportStore = create<IncomesReportState>()((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchIncomesReport: async (params: IncomesReportParams) => {
    set({ isLoading: true, error: null });
    try {
      const response: IncomesReportResponse =
        await IncomesService.getIncomesReport(params);
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