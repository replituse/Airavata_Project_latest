import { StatCard } from "@/components/StatCard";
import { 
  Activity, 
  AlertTriangle, 
  Droplets, 
  Waves, 
  Zap,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElements } from "@/hooks/use-elements";
import { useDams } from "@/hooks/use-dams";

export default function Dashboard() {
  const { data: elements, isLoading: isLoadingElements } = useElements();
  const { data: dams, isLoading: isLoadingDams } = useDams();

  const activeAlerts = dams?.filter(d => d.status !== 'Normal').length || 0;
  const totalCapacity = dams?.reduce((acc, curr) => acc + curr.capacity, 0).toFixed(1) || "0.0";
  const systemHealth = activeAlerts === 0 ? "100%" : activeAlerts < 3 ? "92%" : "78%";

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Real-time overview of hydraulic assets and simulation status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="System Health" 
          value={systemHealth} 
          icon={Activity} 
          trend="up"
          trendValue="2%"
          subtext="vs last month"
        />
        <StatCard 
          title="Active Alerts" 
          value={activeAlerts.toString()} 
          icon={AlertTriangle} 
          trend={activeAlerts > 0 ? "down" : "neutral"}
          trendValue={activeAlerts > 0 ? "+2" : "0"}
          subtext="critical events"
        />
        <StatCard 
          title="Total Reservoir Capacity" 
          value={`${totalCapacity} TMC`} 
          icon={Waves} 
          subtext="Across all dams"
        />
        <StatCard 
          title="Power Generation" 
          value="452 MW" 
          icon={Zap} 
          trend="up"
          trendValue="12%"
          subtext="Optimal efficiency"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity / Element Summary */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>System Elements Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingElements ? (
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                      <Droplets className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pipes & Conduits</p>
                      <p className="text-xs text-muted-foreground">Main transport infrastructure</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">
                    {elements?.filter(e => e.type === 'PIPE').length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-md">
                      <Waves className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reservoirs</p>
                      <p className="text-xs text-muted-foreground">Storage units</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">
                    {elements?.filter(e => e.type === 'RESERVOIR').length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-md">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Turbines</p>
                      <p className="text-xs text-muted-foreground">Power generation units</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">
                    {elements?.filter(e => e.type === 'TURBINE').length || 0}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dam Status List */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Dam Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDams ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                Loading data...
              </div>
            ) : (
              <div className="space-y-4">
                {dams?.slice(0, 5).map((dam) => (
                  <div key={dam.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        dam.status === 'Critical' ? 'bg-red-500 animate-pulse' : 
                        dam.status === 'Alert' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm font-medium">{dam.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {dam.waterLevel}m / {dam.capacity} TMC
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    All sensors operational
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
