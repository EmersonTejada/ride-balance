import type { NewReservation, Reservation } from "@/features/reservations/types/reservation";
import * as ReservationService from "../services/reservation.service";
import { create } from "zustand";

interface ReservationState {
  reservations: Reservation[];
  currentReservation: Reservation | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  fetchReservations: (page?: number) => Promise<void>;
  getReservationById: (id: string) => Promise<void>;
  createReservation: (newReservation: NewReservation) => Promise<{ success: boolean }>;
  confirmReservation: (id: string) => Promise<{ success: boolean }>;
  cancelReservation: (id: string) => Promise<{ success: boolean }>;
  deleteReservation: (id: string) => Promise<{ success: boolean }>;
  clearError: () => void;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  currentReservation: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  fetchReservations: async (page: number = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await ReservationService.getAllReservations(page, get().limit);
      set({
        reservations: data.data,
        page: data.meta.page,
        total: data.meta.total,
        totalPages: data.meta.totalPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  getReservationById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await ReservationService.getReservationById(id);
      set({
        currentReservation: data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  createReservation: async (newReservation: NewReservation) => {
    set({ loading: true, error: null });
    try {
      const data = await ReservationService.createReservation(newReservation);
      set((state) => ({
        reservations: [data.data, ...state.reservations],
        total: state.total + 1,
        loading: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  confirmReservation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await ReservationService.confirmReservation(id);
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? { ...r, status: data.data.status } : r
        ),
        loading: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  cancelReservation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await ReservationService.cancelReservation(id);
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? { ...r, status: data.data.status } : r
        ),
        loading: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  deleteReservation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await ReservationService.deleteReservation(id);
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
        total: state.total - 1,
        loading: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));