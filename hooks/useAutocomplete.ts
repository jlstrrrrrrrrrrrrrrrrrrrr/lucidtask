import { useQuery } from "@tanstack/react-query";
import type { Suggestion } from "@/types/suggestions";

const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
  const response = await fetch(
    `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`
  );
  if (!response.ok) throw new Error("Failed to fetch");
  const data = await response.json();

  const uniqueData: Suggestion[] = data
    .filter((item: Suggestion) => typeof item.value === "number")
    .filter(
      (item: Suggestion, index: number, self: Suggestion[]) =>
        index === self.findIndex((t) => t.id === item.id)
    );

  const filtered = query
    ? uniqueData.filter((item: Suggestion) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : uniqueData.slice(0, 10);

  return filtered.map((item: Suggestion) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    category: item.category,
  }));
};

export const useAutocomplete = (query: string) => {
  return useQuery({
    queryKey: ["autocomplete", query],
    queryFn: () => fetchSuggestions(query),
    enabled: query.length > 0,
  });
};
