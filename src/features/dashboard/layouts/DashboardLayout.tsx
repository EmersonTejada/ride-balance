import { Header } from "@/features/dashboard/components/Header";
import { AppSidebar } from "@/features/dashboard/components/Sidebar";
import { BottomNavigation } from "@/features/dashboard/components/BottomNavigation";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="p-6 md:px-8 md:pb-6 h-full pb-20 relative">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};
