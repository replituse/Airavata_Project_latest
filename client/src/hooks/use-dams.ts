import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDams() {
  return useQuery({
    queryKey: [api.dams.list.path],
    queryFn: async () => {
      const res = await fetch(api.dams.list.path);
      if (!res.ok) throw new Error("Failed to fetch dams");
      return api.dams.list.responses[200].parse(await res.json());
    },
  });
}
