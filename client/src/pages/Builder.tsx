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
import { useState, useCallback, useMemo } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
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
import { generateINP } from "@/lib/inpGenerator";
import { useLocation } from "wouter";

const componentPalette = [
  { id: "CONDUIT", name: "CONDUIT", desc: "Pipe Element", icon: Droplets, color: "bg-blue-500" },
  { id: "RESERVOIR", name: "RESERVOIR", desc: "Boundary Condition", icon: Waves, color: "bg-sky-500" },
  { id: "VALVE", name: "VALVE", desc: "Control Device", icon: Settings, color: "bg-blue-600" },
  { id: "SURGETANK", name: "SURGE TANK", desc: "Pressure Relief", icon: Zap, color: "bg-cyan-500" },
  { id: "D_CHANGE", name: "D CHANGE", desc: "Diameter Change", icon: Database, color: "bg-blue-400" },
];

const nodeTypes = {
  custom: ({ data, selected }: any) => {
    const Icon = data.icon || Activity;
    return (
      <div className={cn(
        "px-4 py-2 shadow-md rounded-md bg-[#2d2d2d] border-2 transition-all",
        selected ? "border-blue-500" : "border-[#444]"
      )}>
        <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-500" />
        <div className="flex items-center">
          <div className={cn("rounded-full p-2 mr-2", data.color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="ml-2">
            <div className="text-[10px] font-bold text-white uppercase">{data.label}</div>
            <div className="text-[8px] text-[#888]">{data.type}</div>
          </div>
        </div>
        <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-500" />
      </div>
    );
  }
};

const menuItems = ["File", "Edit", "View", "Tools", "Help"];

export default function Builder() {
  const { data: elements, isLoading } = useElements();
  const createElement = useCreateElement();
  const deleteElement = useDeleteElement();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const [inpPreview, setInpPreview] = useState("");

  const generateInp = useCallback(() => {
    if (!elements) return;
    const inp = generateINP(elements);
    setInpPreview(inp);
  }, [elements]);

  useMemo(() => {
    if (elements) {
      const newNodes = elements.map((el, index) => {
        const comp = componentPalette.find(c => c.id === el.type);
        return {
          id: el.id.toString(),
          type: 'custom',
          position: { x: 100 + (index * 200) % 600, y: 100 + Math.floor(index / 3) * 150 },
          data: { 
            label: el.name, 
            type: el.type,
            icon: comp?.icon,
            color: comp?.color
          },
        };
      });
      setNodes(newNodes);
    }
  }, [elements, setNodes]);

  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedElementId(parseInt(node.id));
  }, []);

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
          <ToolbarButton 
            icon={Play} 
            tooltip="Run Simulation" 
            className="text-blue-400" 
            onClick={() => setLocation("/simulation")}
          />
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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#333" gap={24} />
            <Controls className="bg-[#2d2d2d] border-[#444] fill-white" />
            <MiniMap 
              style={{ backgroundColor: '#1e1e1e' }} 
              nodeColor={(n) => n.data?.color === 'bg-blue-500' ? '#3b82f6' : '#666'}
              maskColor="rgba(0, 0, 0, 0.3)"
            />
          </ReactFlow>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-72 bg-[#252526] border-l border-[#333] flex flex-col">
          <div className="p-3 text-xs font-semibold text-[#888] flex items-center gap-2 uppercase tracking-widest border-b border-[#333]">
            <FileText className="w-3 h-3" /> Properties & Output
          </div>
          
          <div className="flex-1 p-4 flex flex-col overflow-y-auto">
            {!selectedElement ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#555]">
                <FileText className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-xs leading-relaxed max-w-[180px]">Select a component or generate .inp file</p>
                <Button variant="outline" size="sm" className="mt-4 border-[#444] text-[#aaa]" onClick={generateInp}>
                  Generate .inp Preview
                </Button>
                {inpPreview && (
                  <pre className="mt-4 p-2 bg-[#121212] text-[10px] text-green-500 w-full text-left overflow-x-auto border border-[#333] rounded">
                    {inpPreview}
                  </pre>
                )}
              </div>
            ) : (
              <div className="w-full text-left">
                <div className="mb-4">
                  <Label className="text-[10px] text-[#888] uppercase font-bold tracking-wider">Type</Label>
                  <div className="text-white font-bold">{selectedElement.type}</div>
                </div>
                <div className="mb-4">
                  <Label className="text-[10px] text-[#888] uppercase font-bold tracking-wider">ID / Name</Label>
                  <div className="text-white font-bold">{selectedElement.name}</div>
                </div>
                <Separator className="bg-[#333] my-4" />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full mb-4"
                  onClick={() => {
                    deleteElement.mutate(selectedElement.id);
                    setSelectedElementId(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Component
                </Button>
                <Button variant="outline" size="sm" className="w-full border-[#444] text-[#aaa]" onClick={generateInp}>
                  Refresh .inp Preview
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, tooltip, className, onClick }: { icon: any, tooltip: string, className?: string, onClick?: () => void }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8 text-[#aaa] hover:text-white hover:bg-[#444] rounded", className)}
            onClick={onClick}
          >
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

