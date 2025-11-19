import { useAuthStore } from "@/stores/useAuthStore";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface RequireAuthProps {
  children: React.ReactNode;
}
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate, loading]);

   if (loading) {
    return <div>Cargando...</div>; // o un spinner
  }

  return user ? children : null;
};
