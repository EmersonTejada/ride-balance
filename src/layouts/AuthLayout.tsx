import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="container mx-auto px-4">
      <main className="h-screen flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};
