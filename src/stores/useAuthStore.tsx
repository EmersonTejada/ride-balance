import type { LoginUser, NewUser } from "@/types/user";
import { create } from "zustand";
import * as AuthService from "../services/auth.service";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  signUp: (newUser: NewUser) => Promise<{success: boolean}>;
  login: (user: LoginUser) => Promise<{success: boolean}>
  checkSession: () => Promise<void>
  signInWithGoogle: () => Promise<{success: boolean}>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signUp: async (newUser: NewUser) => {
    set({ loading: true, error: null });

    const { data, error } = await AuthService.signUp(
      newUser.email,
      newUser.password
    );

    if (error) {
      set({ loading: false, error: error.message });
      return {success: false}
    }

    set({user: data.user, loading: false, error: null})
    return {success: true}
  },

  login: async (user: LoginUser) => {
    set({loading: true, error: null})

    const {data, error} = await AuthService.signIn(user.email, user.password)

    if(error) {
      set({loading: false, error: error.message})
      return {success: false}
    }

    set({user: data.user, loading: false, error: null})
    return {success: true}
  },

  checkSession: async () => {
    set({loading: true, error: null})
    const {data} = await AuthService.getUser()
    set({user: data.user ?? null, loading: false, error: null})
  },

  signInWithGoogle: async () => {
    set({loading: true, error: null})
    const {error} = await AuthService.loginWithGoogle()

    if(error) {
      set({loading: false, error: error.message})
      return {success: false}
    }
    set({loading: false, error: null})
    return {success: true}
  }
}));
