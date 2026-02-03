import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRunSimulation() {
  return useMutation({
    mutationFn: async ({ duration }: { duration: number }) => {
      const res = await fetch(api.simulation.run.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration }),
      });
      if (!res.ok) throw new Error("Simulation failed");
      return api.simulation.run.responses[200].parse(await res.json());
    },
  });
}
