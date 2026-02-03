import type { NewExpense, Expense, ExpenseFilters } from "@/schemas/expense.schema";
import * as ExpenseService from "../services/expense.service";
import { create } from "zustand";

interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  loading: boolean;
  error: string | null;

  fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
  getExpenseById: (id: string) => Promise<void>;
  addExpense: (newExpense: NewExpense) => Promise<{success: boolean}>;
  updateExpense: (id: string, expense: Partial<NewExpense>) => Promise<{success: boolean}>;
  deleteExpense: (id: string) => Promise<{success: boolean}>;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  currentExpense: null,
  loading: false,
  error: null,

  fetchExpenses: async (filters?: ExpenseFilters) => {
    set({ loading: true, error: null });
    try {
      const data = await ExpenseService.getAllExpenses(filters);
      set({ expenses: data.data.map((expense: Record<string, unknown>) => ({ ...expense, amount: parseFloat(expense.amount as string) })), loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  getExpenseById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await ExpenseService.getExpenseById(id);
      set({ currentExpense: data.data, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  addExpense: async (newExpense: NewExpense) => {
    set({ loading: true, error: null });
    try {
      const data = await ExpenseService.createExpense(newExpense);
      set((state) => ({ expenses: [...state.expenses, { ...data.data, amount: parseFloat(data.data.amount) }], loading: false, error: null }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  updateExpense: async (id: string, expense: Partial<NewExpense>) => {
    set({ loading: true, error: null });
    try {
      const data = await ExpenseService.updateExpense(id, expense);
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? { ...data.data, amount: parseFloat(data.data.amount) } : e)),
        loading: false,
        error: null
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  deleteExpense: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await ExpenseService.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        loading: false,
        error: null
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));
