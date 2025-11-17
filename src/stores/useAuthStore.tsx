import type { User } from "@/types/user";
import {create} from "zustand"

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = create<AuthState>(() => ({
    user: null,
    loading: false,
    error: null    
}))

