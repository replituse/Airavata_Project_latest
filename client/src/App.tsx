import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

// Pages
import Dashboard from "@/pages/Dashboard";
import MapView from "@/pages/MapView";
import Builder from "@/pages/Builder";
import Simulation from "@/pages/Simulation";
import Reports from "@/pages/Reports";

function Router() {
  const [location] = useLocation();
  const isBuilder = location === "/builder";

  return (
    <div className="flex min-h-screen bg-background">
      {!isBuilder && <Sidebar />}
      <main className={cn("flex-1 relative overflow-hidden", !isBuilder && "md:ml-64")}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dams" component={MapView} />
          <Route path="/builder" component={Builder} />
          <Route path="/simulation" component={Simulation} />
          <Route path="/reports" component={Reports} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
