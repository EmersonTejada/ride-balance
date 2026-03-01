import { DashboardLayout } from "@/features/dashboard/layouts/DashboardLayout";
import { Landing } from "@/features/landing/pages/Landing";
import { Route, Routes } from "react-router";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { AuthLayout } from "@/features/auth/layouts/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { AuthCallback } from "@/features/auth/components/AuthCallback";
import { WeeklySummary } from "@/features/weekly-summary/pages/WeeklySummary";
import { Incomes } from "@/features/rides/pages/Incomes";
import { Expenses } from "@/features/expenses/pages/Expenses";
import { Profile } from "@/features/profile/pages/Profile";
import { Reports } from "@/features/reports/pages/Reports";

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
        <Route index element={<WeeklySummary />} />
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
