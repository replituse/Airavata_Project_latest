import { 
  File, 
  FolderOpen, 
  Save, 
  Undo2, 
  Redo2, 
  Play, 
  Square, 
  Search, 
  ZoomIn, 
  ZoomOut,
  MousePointer2,
  Trash2,
  Settings,
  HelpCircle,
  FileText,
  Activity,
  Map as MapIcon,
  LayoutDashboard,
  Droplets,
  Zap,
  Waves,
  Database,
  Thermometer,
  ArrowDownCircle,
  Plus
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useElements, useCreateElement, useDeleteElement } from "@/hooks/use-elements";
import { useToast } from "@/hooks/use-toast";

const componentPalette = [
  { id: "CONDUIT", name: "CONDUIT", desc: "Pipe Element", icon: Droplets, color: "bg-blue-500" },
  { id: "RESERVOIR", name: "RESERVOIR", desc: "Boundary Condition", icon: Waves, color: "bg-sky-500" },
  { id: "VALVE", name: "VALVE", desc: "Control Device", icon: Settings, color: "bg-blue-600" },
  { id: "SURGETANK", name: "SURGE TANK", desc: "Pressure Relief", icon: Zap, color: "bg-cyan-500" },
  { id: "D_CHANGE", name: "D CHANGE", desc: "Diameter Change", icon: Database, color: "bg-blue-400" },
];

const menuItems = ["File", "Edit", "View", "Tools", "Help"];

export default function Builder() {
  const { data: elements, isLoading } = useElements();
  const createElement = useCreateElement();
  const deleteElement = useDeleteElement();
  const { toast } = useToast();
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);

  const handleAddComponent = (type: string) => {
    createElement.mutate({
      type,
      name: `${type}-${Date.now().toString().slice(-4)}`,
      properties: {}
    }, {
      onSuccess: () => {
        toast({ title: "Component Added", description: `New ${type} added to canvas.` });
      }
    });
  };

  const selectedElement = elements?.find(e => e.id === selectedElementId);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden select-none">
      {/* Menu Bar */}
      <div className="flex items-center px-4 h-8 bg-[#252526] border-b border-[#333] text-sm">
        <div className="flex gap-4 mr-8">
          {menuItems.map(item => (
            <span key={item} className="cursor-pointer hover:text-white transition-colors">{item}</span>
          ))}
        </div>
        <div className="text-[#4ec9b0] font-medium text-xs tracking-wider">
          Hydro Transient Model Studio
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 h-12 bg-[#2d2d2d] border-b border-[#333]">
        <div className="flex gap-1 pr-4 border-r border-[#444]">
          <ToolbarButton icon={File} tooltip="New File" />
          <ToolbarButton icon={FolderOpen} tooltip="Open File" />
          <ToolbarButton icon={Save} tooltip="Save Project" />
        </div>
        <div className="flex gap-1 px-4 border-r border-[#444]">
          <ToolbarButton icon={Undo2} tooltip="Undo" />
          <ToolbarButton icon={Redo2} tooltip="Redo" />
        </div>
        <div className="flex gap-1 px-4 border-r border-[#444]">
          <ToolbarButton icon={Play} tooltip="Run Simulation" className="text-blue-400" />
          <ToolbarButton icon={Square} tooltip="Stop Simulation" />
        </div>
        <div className="flex gap-1 px-4">
          <ToolbarButton icon={ZoomIn} tooltip="Zoom In" />
          <ToolbarButton icon={ZoomOut} tooltip="Zoom Out" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Component Palette */}
        <div className="w-64 bg-[#252526] border-r border-[#333] flex flex-col">
          <div className="p-3 text-xs font-semibold text-[#888] flex items-center gap-2 uppercase tracking-widest">
            <Zap className="w-3 h-3 text-yellow-500" /> Component Palette
          </div>
          <div className="p-2 space-y-2 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] text-[#555] font-bold uppercase">Hydraulic Components</div>
            {componentPalette.map(comp => (
              <button
                key={comp.id}
                onClick={() => handleAddComponent(comp.id)}
                className="w-full flex items-center gap-3 p-2 rounded bg-[#333] hover:bg-[#444] border border-transparent hover:border-[#555] transition-all group text-left"
              >
                <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white", comp.color)}>
                  <comp.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#ccc] group-hover:text-white">{comp.name}</div>
                  <div className="text-[10px] text-[#888]">{comp.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Central Canvas */}
        <div className="flex-1 relative bg-[#121212] overflow-hidden group">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }} 
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-[#444]">
            <MousePointer2 className="w-16 h-16 mb-4 opacity-20" />
            <div className="text-lg font-medium opacity-40">Drag components from the palette to design your hydraulic system</div>
            <div className="text-sm opacity-20 uppercase tracking-[0.2em] mt-2 font-bold">Design Canvas</div>
          </div>

          {/* Rendered Elements (Simple Visual List for Canvas) */}
          <div className="absolute inset-0 p-8 flex flex-wrap gap-6 content-start overflow-auto">
            {elements?.map((el) => (
              <div
                key={el.id}
                onClick={() => setSelectedElementId(el.id)}
                className={cn(
                  "w-24 h-24 rounded-lg bg-[#2d2d2d] border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105",
                  selectedElementId === el.id ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-[#444] hover:border-[#666]"
                )}
              >
                <div className="w-10 h-10 rounded bg-[#333] flex items-center justify-center text-blue-400">
                  <Waves className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold truncate max-w-full px-2 uppercase">{el.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-72 bg-[#252526] border-l border-[#333] flex flex-col">
          <div className="p-3 text-xs font-semibold text-[#888] flex items-center gap-2 uppercase tracking-widest border-b border-[#333]">
            <FileText className="w-3 h-3" /> Properties
          </div>
          
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-[#555]">
            {!selectedElement ? (
              <>
                <FileText className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-xs leading-relaxed max-w-[180px]">Select a component to view and edit its properties</p>
              </>
            ) : (
              <div className="w-full text-left self-start">
                <div className="mb-6">
                  <Label className="text-[10px] text-[#888] uppercase font-bold tracking-wider">Type</Label>
                  <div className="text-white font-bold">{selectedElement.type}</div>
                </div>
                <div className="mb-6">
                  <Label className="text-[10px] text-[#888] uppercase font-bold tracking-wider">ID / Name</Label>
                  <div className="text-white font-bold">{selectedElement.name}</div>
                </div>
                <Separator className="bg-[#333] my-4" />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    deleteElement.mutate(selectedElement.id);
                    setSelectedElementId(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Component
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, tooltip, className }: { icon: any, tooltip: string, className?: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8 text-[#aaa] hover:text-white hover:bg-[#444] rounded", className)}>
            <Icon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[#111] text-white border-[#333] text-[10px]">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("mb-1", className)}>{children}</div>;
}
