export interface TimeOption {
  type: "single" | "span" | "custom";
  value: string;
  label: string;
}

export interface Token {
  id: string;
  type: "variable" | "number" | "operator";
  name?: string;
  value: number | string;
  timeOption?: TimeOption;
}

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  value: number | string;
}
