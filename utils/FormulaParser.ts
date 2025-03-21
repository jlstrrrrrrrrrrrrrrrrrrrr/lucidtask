import { evaluate } from "mathjs";
import type { Token } from "@/stores/formula_store";

export const evaluateFormula = (tokens: Token[]): string | number => {
  try {
    if (tokens.length === 0) return "";

    const expression = tokens
      .map((token) => {
        if (token.type === "variable") {
          const value = token.value !== undefined ? Number(token.value) : 0;
          const multiplier = token.multiplier ?? 1;
          return (value * multiplier).toString();
        }
        return token.value;
      })
      .join(" ");

    console.log("Evaluating:", expression);

    if (/[\+\-\*\/\^]$/.test(expression.trim())) {
      return "Incomplete Formula";
    }

    const result = evaluate(expression);
    return typeof result === "number" ? Number(result.toFixed(2)) : result;
  } catch (error) {
    console.error("Formula Evaluation Error:", error);
    return "Invalid Formula";
  }
};
