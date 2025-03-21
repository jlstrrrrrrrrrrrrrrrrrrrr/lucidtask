"use client";

import FormulaEditor from "@/components/FormulaEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Lucid Task</h1>
        <FormulaEditor />
      </main>
    </QueryClientProvider>
  );
}
