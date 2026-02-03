import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/Sidebar";

// Pages
import Dashboard from "@/pages/Dashboard";
import MapView from "@/pages/MapView";
import Builder from "@/pages/Builder";
import Simulation from "@/pages/Simulation";
import Reports from "@/pages/Reports";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative overflow-hidden">
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
