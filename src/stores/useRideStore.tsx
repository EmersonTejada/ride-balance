import type { NewRide, Ride, RideFilters } from "@/types/ride";
import * as RideService from "../services/ride.service";
import { create } from "zustand";

interface RideState {
  rides: Ride[];
  currentRide: Ride | null;
  loading: boolean;
  error: string | null;

  fetchRides: (filters?: RideFilters) => Promise<void>;
  getRideById: (id: string) => Promise<void>;
  addRide: (newRide: NewRide) => Promise<{success: boolean}>;
  updateRide: (id: string, ride: Partial<NewRide>) => Promise<{success: boolean}>;
  deleteRide: (id: string) => Promise<{success: boolean}>;
  clearError: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  rides: [],
  currentRide: null,
  loading: false,
  error: null,

  fetchRides: async (filters?: RideFilters) => {
    set({ loading: true, error: null });
    try {
      const data = await RideService.getAllRides(filters);
      set({ rides: data.data.map((ride: any) => ({ ...ride, amount: parseFloat(ride.amount) })), loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  getRideById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await RideService.getRideById(id);
      set({ currentRide: data.data, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  addRide: async (newRide: NewRide) => {
    set({ loading: true, error: null });
    try {
      const data = await RideService.createRide(newRide);
      set((state) => ({ rides: [...state.rides, { ...data.data, amount: parseFloat(data.data.amount) }], loading: false, error: null }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  updateRide: async (id: string, ride: Partial<NewRide>) => {
    set({ loading: true, error: null });
    try {
      const data = await RideService.updateRide(id, ride);
      set((state) => ({
        rides: state.rides.map((r) => (r.id === id ? { ...data.data, amount: parseFloat(data.data.amount) } : r)),
        loading: false,
        error: null
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  deleteRide: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await RideService.deleteRide(id);
      set((state) => ({
        rides: state.rides.filter((r) => r.id !== id),
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