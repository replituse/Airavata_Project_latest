import { useElements, useCreateElement, useDeleteElement } from "@/hooks/use-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertElementSchema, type InsertElement } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useState } from "react";

// Extend the base schema to handle the JSONB properties properly in the form
const formSchema = insertElementSchema.extend({
  properties: z.object({
    length: z.coerce.number().optional(),
    diameter: z.coerce.number().optional(),
    elevation: z.coerce.number().optional(),
    loss: z.coerce.number().optional(),
    power: z.coerce.number().optional(),
    elTop: z.coerce.number().optional(),
    elBottom: z.coerce.number().optional(),
    celerity: z.coerce.number().optional(),
    friction: z.coerce.number().optional(),
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function Builder() {
  const { data: elements, isLoading } = useElements();
  const createElement = useCreateElement();
  const deleteElement = useDeleteElement();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("PIPE");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PIPE",
      name: "",
      properties: {},
    },
  });

  const onSubmit = (data: FormValues) => {
    createElement.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Element Added",
          description: `${data.type} ${data.name} has been added to the system.`,
        });
        form.reset({
          type: selectedType,
          name: "",
          properties: {},
        });
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue("type", value);
    // Reset properties when type changes to avoid pollution
    form.setValue("properties", {});
  };

  const handleDelete = (id: number) => {
    deleteElement.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Deleted",
          description: "Element removed from system.",
        });
      },
    });
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-50/50">
      {/* Left Panel: Form */}
      <div className="w-full md:w-[400px] p-6 bg-white border-r overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">System Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure hydraulic network topology.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Element Type</FormLabel>
                  <Select onValueChange={(val) => handleTypeChange(val)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PIPE">Pipe / Conduit</SelectItem>
                      <SelectItem value="VALVE">Valve</SelectItem>
                      <SelectItem value="RESERVOIR">Reservoir</SelectItem>
                      <SelectItem value="TURBINE">Turbine</SelectItem>
                      <SelectItem value="SURGETANK">Surge Tank</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Element ID / Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. PIPE-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Properties
                <span className="text-xs font-normal text-muted-foreground bg-white px-2 py-0.5 rounded border">
                  {selectedType}
                </span>
              </h3>

              {selectedType === "PIPE" && (
                <>
                  <FormField
                    control={form.control}
                    name="properties.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Length (m)</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="properties.diameter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Diameter (m)</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="properties.friction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Friction Factor</FormLabel>
                        <FormControl><Input type="number" step="0.001" placeholder="0.012" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {selectedType === "RESERVOIR" && (
                <FormField
                  control={form.control}
                  name="properties.elevation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Elevation (m)</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "VALVE" && (
                <FormField
                  control={form.control}
                  name="properties.loss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Loss Coefficient</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "TURBINE" && (
                <FormField
                  control={form.control}
                  name="properties.power"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Rated Power (MW)</FormLabel>
                      <FormControl><Input type="number" step="1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "SURGETANK" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="properties.elTop"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Top Elev (m)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="properties.elBottom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Bottom Elev (m)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="properties.diameter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tank Diameter (m)</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all"
              disabled={createElement.isPending}
            >
              {createElement.isPending ? "Adding..." : (
                <><Plus className="w-4 h-4 mr-2" /> Add Element</>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Right Panel: List */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-sm border-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Components</CardTitle>
                <CardDescription>
                  Review and manage the hydraulic network elements.
                </CardDescription>
              </div>
              <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-600">
                {elements?.length || 0} ITEMS
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-lg" />)}
                </div>
              ) : elements?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>No elements added yet.</p>
                  <p className="text-xs mt-1">Use the form on the left to build your system.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {elements?.map((element) => (
                    <div 
                      key={element.id} 
                      className="group flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center font-bold text-slate-400 border text-xs">
                          {element.type.slice(0, 3)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{element.name}</h4>
                          <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                            {Object.entries(element.properties).map(([k, v]) => (
                              <span key={k} className="mr-3">{k.toUpperCase()}: {v}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(element.id)}
                        disabled={deleteElement.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
