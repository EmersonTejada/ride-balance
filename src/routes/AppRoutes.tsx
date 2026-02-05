import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Landing } from "@/pages/Landing";
import { Route, Routes } from "react-router";
import { RequireAuth } from "./RequireAuth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { AuthCallback } from "./AuthCallback";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Incomes } from "@/pages/dashboard/Incomes";
import { Expenses } from "@/pages/dashboard/Expenses";
import { Profile } from "@/pages/dashboard/Profile";
import { Reports } from "@/pages/dashboard/Reports";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="auth/callback" element={<AuthCallback />} />

      <Route
        path="app"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="incomes" element={<Incomes />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignUpForm />} />
      </Route>
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};
