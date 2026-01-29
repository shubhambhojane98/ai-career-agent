import { DashboardSidebar } from "@/components/dashboard-sidebar";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile top spacing (if sidebar is fixed) */}
        <div className="h-14 lg:hidden" />

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
