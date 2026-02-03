import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ElementInput } from "@shared/routes";

export function useElements() {
  return useQuery({
    queryKey: [api.elements.list.path],
    queryFn: async () => {
      const res = await fetch(api.elements.list.path);
      if (!res.ok) throw new Error("Failed to fetch elements");
      return api.elements.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateElement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ElementInput) => {
      const res = await fetch(api.elements.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create element");
      return api.elements.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.elements.list.path] });
    },
  });
}

export function useDeleteElement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.elements.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete element");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.elements.list.path] });
    },
  });
}
