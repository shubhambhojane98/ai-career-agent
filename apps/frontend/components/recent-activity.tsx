import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Video, Upload, TrendingUp } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "resume",
    title: "Resume uploaded",
    description: "Software_Engineer_Resume.pdf",
    timestamp: "2 hours ago",
    icon: Upload,
  },
  {
    id: 2,
    type: "interview",
    title: "Mock interview completed",
    description: "Behavioral interview - 45 minutes",
    timestamp: "5 hours ago",
    icon: Video,
  },
  {
    id: 3,
    type: "score",
    title: "ATS score improved",
    description: "Score increased from 72 to 85",
    timestamp: "1 day ago",
    icon: TrendingUp,
  },
  {
    id: 4,
    type: "resume",
    title: "Resume analyzed",
    description: "Identified 3 new skill gaps",
    timestamp: "2 days ago",
    icon: FileCheck,
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
