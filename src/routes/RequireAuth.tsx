import { useAuthStore } from "@/stores/useAuthStore";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface RequireAuthProps {
  children: React.ReactNode;
}
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  
  return user ? children : null;
};
