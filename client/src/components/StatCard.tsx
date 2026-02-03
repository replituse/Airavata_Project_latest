import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({ title, value, subtext, icon: Icon, trend, trendValue }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(subtext || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {trend && trendValue && (
              <span className={
                trend === "up" ? "text-green-600 font-medium" : 
                trend === "down" ? "text-red-600 font-medium" : 
                "text-gray-600"
              }>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </span>
            )}
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
