import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Map, 
  Activity, 
  Wrench, 
  FileText,
  Menu,
  Droplets
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Dam Monitoring", icon: Map, href: "/dams" },
  { label: "System Builder", icon: Wrench, href: "/builder" },
  { label: "Simulation", icon: Activity, href: "/simulation" },
  { label: "Reports", icon: FileText, href: "/reports" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">HydroSim</h1>
            <p className="text-xs text-muted-foreground mt-1">v2.4.0 (Enterprise)</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  location === item.href
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground font-mono">
            System Status: <span className="text-green-600 font-bold">ONLINE</span>
            <br />
            Last Sync: 2m ago
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg bg-background">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <Droplets className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-lg">HydroSim</h1>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      location === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
