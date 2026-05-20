import { create } from "zustand";
import type {
  ExpensesReportParams,
  ExpensesReportResponse,
} from "@/features/reports/schemas/expenses-report.schema";
import * as ExpensesService from "../services/expenses.service";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface ExpensesReportState {
  data: ExpensesReportResponse["data"] | null;
  isLoading: boolean;
  error: string | null;

  fetchExpensesReport: (params: ExpensesReportParams) => Promise<void>;
  resetStore: () => void;
}

export const useExpensesReportStore = create<ExpensesReportState>()((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchExpensesReport: async (params: ExpensesReportParams) => {
    set({ isLoading: true, error: null });
    try {
      const response: ExpensesReportResponse =
        await ExpensesService.getExpensesReport(params);
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