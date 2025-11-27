import { Header } from "@/components/dashboard/Header";
import { AppSidebar } from "@/components/dashboard/Sidebar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
    </SidebarProvider>
  );
};
