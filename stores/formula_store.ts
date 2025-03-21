import { create } from "zustand";
import type { TimeOption } from "@/types/suggestions";

export type Token = {
  id: string;
  type: "variable" | "number" | "operator";
  name?: string;
  value: number | string;
  timeOption?: TimeOption;
  multiplier?: number;
};

interface FormulaState {
  tokens: Token[];
  setTokens: (tokens: Token[]) => void;
  addToken: (token: Token) => void;
  removeLastToken: () => void;
  updateToken: (id: string, updates: Partial<Token>) => void;
}

export const useFormulaStore = create<FormulaState>((set) => ({
  tokens: [],
  setTokens: (tokens) => set({ tokens }),
  addToken: (token) =>
    set((state) => ({
      tokens: [...state.tokens, token],
    })),
  removeLastToken: () =>
    set((state) => ({
      tokens: state.tokens.slice(0, -1),
    })),
  updateToken: (id, updates) =>
    set((state) => ({
      tokens: state.tokens.map((token) =>
        token.id === id ? { ...token, ...updates } : token
      ),
    })),
}));
