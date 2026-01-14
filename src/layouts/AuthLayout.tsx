import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export const AuthLayout = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/app", { replace: true });
    }
  }, [user, navigate]);
  
  return (
    <div className="container mx-auto px-4">
      <main className="h-screen flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};
