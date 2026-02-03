import { useState } from "react";
import { useElements } from "@/hooks/use-elements";
import { useRunSimulation } from "@/hooks/use-simulation";
import { generateINP } from "@/lib/inpGenerator";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Play, Download, Settings, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function Simulation() {
  const { data: elements } = useElements();
  const runSimulation = useRunSimulation();
  const [duration, setDuration] = useState<number>(20);
  const [results, setResults] = useState<any[]>([]);

  const handleRun = () => {
    runSimulation.mutate({ duration }, {
      onSuccess: (data) => {
        setResults(data.results);
      }
    });
  };

  const handleDownloadINP = () => {
    if (!elements) return;
    const inpContent = generateINP(elements);
    const blob = new Blob([inpContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "simulation_model.inp");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Simulation Runner</h2>
          <p className="text-muted-foreground mt-2">
            Execute hydraulic transient analysis using the current system configuration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleDownloadINP}
            disabled={!elements || elements.length === 0}
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export INP
          </Button>
          <Button 
            onClick={handleRun}
            disabled={runSimulation.isPending}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 min-w-[140px]"
          >
            {runSimulation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            {runSimulation.isPending ? "Running..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Card */}
        <Card className="lg:col-span-1 shadow-sm h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Parameters</CardTitle>
            </div>
            <CardDescription>Configure simulation bounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Duration (seconds)</Label>
                <span className="font-mono text-sm font-medium bg-slate-100 px-2 py-0.5 rounded">
                  {duration}s
                </span>
              </div>
              <Slider
                value={[duration]}
                min={5}
                max={100}
                step={1}
                onValueChange={(vals) => setDuration(vals[0])}
                className="py-4"
              />
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-900">
              <p className="font-semibold mb-1">Note:</p>
              Simulations use a default time step of 0.01s. Large durations may take longer to compute.
            </div>
          </CardContent>
        </Card>

        {/* Results Chart */}
        <Card className="lg:col-span-2 shadow-sm min-h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>Transient Response</CardTitle>
            <CardDescription>
              Head pressure and flow rate over time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[400px]">
            {results.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={results} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(val) => val.toFixed(1)}
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: 'Head (m)', angle: -90, position: 'insideLeft' }}
                    stroke="#0ea5e9"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: 'Flow (m³/s)', angle: 90, position: 'insideRight' }}
                    stroke="#10b981"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="head" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={false} 
                    name="Head (m)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="flow" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false} 
                    name="Flow (m³/s)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50 rounded-lg border-2 border-dashed">
                <Activity className="w-12 h-12 mb-4 text-slate-300" />
                <p>Run simulation to view results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
