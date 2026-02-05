import { useAuthStore } from "@/stores/useAuthStore";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
};
