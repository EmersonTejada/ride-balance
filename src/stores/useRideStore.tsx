import type { NewRide, Ride, RideFilters } from "@/types/ride";
import * as RideService from "../services/ride.service";
import { create } from "zustand";

interface RideState {
  rides: Ride[];
  loading: boolean;
  error: string | null;

  fetchRides: (filters?: RideFilters) => Promise<void>;
  addRide: (newRide: NewRide) => Promise<{success: boolean}>;
  clearError: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  rides: [],
  loading: false,
  error: null,

  fetchRides: async (filters?: RideFilters) => {
    set({ loading: true, error: null });
    try {
      const data = await RideService.getAllRides(filters);
      set({ rides: data.data, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  addRide: async (newRide: NewRide) => {
    set({ loading: true, error: null });
    try {
      const data = await RideService.createRide(newRide);
      set((state) => ({ rides: [...state.rides, data.data], loading: false, error: null }));
      return { success: true };
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));