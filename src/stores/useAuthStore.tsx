import type { LoginUser, NewUser, User } from "@/types/user";
import { create } from "zustand";
import * as AuthService from "../services/auth.service";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  signUp: (newUser: NewUser) => Promise<{success: boolean}>;
  login: (user: LoginUser) => Promise<{success: boolean}>;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{success: boolean}>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  signUp: async (newUser: NewUser) => {
    set({ loading: true, error: null });

    try {
      await AuthService.signUp(newUser);
      await get().checkSession()
      set({loading: false, error: null})
      return {success: true}
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      return {success: false}
    }
  },

  login: async (user: LoginUser) => {
    set({loading: true, error: null})

    try {
      await AuthService.signIn(user.email, user.password)
      await get().checkSession()
      set({loading: false, error: null})
      return {success: true}
    } catch (error) {
      set({loading: false, error: (error as Error).message})
      return {success: false}
    }
  },

  checkSession: async () => {
    set({loading: true, error: null})
    try {
      const data = await AuthService.getUser()
      console.log('checkSession data:', data)
      set({user: data.data.user, loading: false, error: null})
    } catch (error) {
      console.log('checkSession error:', error)
      set({user: null, loading: false, error: (error as Error).message})
    }
  },

  signOut: async () => {
    set({loading: true, error: null})
    try {
      const data = await AuthService.signOut()
      console.log(data)
      set({user: null, loading: false, error: null})
    } catch (error) {
      set({loading: false, error: (error as Error).message})
    }
  },

  signInWithGoogle: async () => {
    set({loading: true, error: null})
    try {
      // await AuthService.loginWithGoogle()
      throw new Error("Google login not implemented")
      await get().checkSession()
      set({loading: false, error: null})
      return {success: true}
    } catch (error) {
      set({loading: false, error: (error as Error).message})
      return {success: false}
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));
