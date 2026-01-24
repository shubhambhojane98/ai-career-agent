import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MetricCard } from "@/components/metric-card";
import { RecentActivity } from "@/components/recent-activity";
import { FileCheck, Video, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const userName = "John";

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile top spacing */}
        <div className="h-14 lg:hidden" />

        <div className="p-6 lg:p-8 space-y-8">
          {/* Welcome section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Welcome back, {userName}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your career progress and continue improving your job search
              skills.
            </p>
          </div>

          {/* Metrics grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Resume ATS Score"
              value="85/100"
              icon={FileCheck}
              description="Excellent match for tech roles"
              trend={{ value: "+13 points", isPositive: true }}
            />
            <MetricCard
              title="Interviews Practiced"
              value="12"
              icon={Video}
              description="7.5 hours total practice"
              trend={{ value: "+4 this week", isPositive: true }}
            />
            <MetricCard
              title="Skill Gaps Identified"
              value="3"
              icon={AlertCircle}
              description="Focus on cloud & leadership"
            />
          </div>

          {/* Recent activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
