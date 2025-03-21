"use client";

import React, { useRef, useState } from "react";
import { useFormulaStore } from "@/stores/formula_store";
import { evaluateFormula } from "@/utils/FormulaParser";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import Tag from "@/components/ui/Tag";
import SuggestionsDropdown from "@/components/ui/SuggestionsDropdown";
import type { Suggestion, TimeOption } from "@/types/suggestions";
import { cn } from "@/lib/utils";

export default function FormulaEditor() {
  const { tokens, addToken, removeLastToken, updateToken } = useFormulaStore();
  const [input, setInput] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: suggestions = [] } = useAutocomplete(input);

  const formattedSuggestions: Suggestion[] = suggestions.map((s) => ({
    id: s.id,
    name: s.name,
    value: s.value,
    category: s.category,
  }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      if (formattedSuggestions.length > 0 && highlightedIndex !== -1) {
        handleSuggestionClick(formattedSuggestions[highlightedIndex]);
      } else {
        createTokenFromInput(input);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (formattedSuggestions.length > 0 && highlightedIndex !== -1) {
        handleSuggestionClick(formattedSuggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setError(null);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % formattedSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? formattedSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Backspace" && input === "") {
      removeLastToken();
      setError(null);
    } else if (/^[+\-*/^()]$/.test(e.key)) {
      e.preventDefault();
      if (input.trim() !== "") {
        createTokenFromInput(input);
      }
      addToken({
        id: crypto.randomUUID(),
        type: "operator",
        value: e.key,
      });
      setInput("");
      setError(null);
    } else if (/^[0-9.]$/.test(e.key) && formattedSuggestions.length === 0) {
      setError(null);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    const isTypingNumber = /^-?\d*\.?\d*$/.test(newValue.trim());
    const hasNonSpaceContent = newValue.trim() !== "";
    setIsDropdownOpen(!isTypingNumber && hasNonSpaceContent);

    setError(null);
  };

  const createTokenFromInput = (val: string) => {
    const trimmed = val.trim();
    if (trimmed === "") return;
    const isNumber = !isNaN(Number(trimmed));

    if (isNumber) {
      addToken({
        id: crypto.randomUUID(),
        type: "number",
        name: trimmed,
        value: Number(trimmed),
      });
      setError(null);
    } else {
      const matchingSuggestion = formattedSuggestions.find(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase()
      );

      if (matchingSuggestion) {
        addToken({
          id: crypto.randomUUID(),
          type: "variable",
          name: matchingSuggestion.name,
          value: matchingSuggestion.value,
        });
        setError(null);
      } else {
        setError(
          "Invalid input. Please use numbers or select from suggestions."
        );
        return;
      }
    }

    setInput("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    addToken({
      id: crypto.randomUUID(),
      type: "variable",
      name: suggestion.name,
      value: suggestion.value || 0,
    });

    setInput("");
    inputRef.current?.focus();
  };

  const handleMonthSelect = (tokenId: string, timeOption: TimeOption) => {
    let multiplier = 1;
    switch (timeOption.value) {
      case "this_month":
        multiplier = 1;
        break;
      case "previous_month":
        multiplier = 0.95;
        break;
      case "1_year_ago":
        multiplier = 0.88;
        break;
      case "last_3_months":
        multiplier = 0.97;
        break;
      case "last_12_months":
        multiplier = 0.94;
        break;
      case "calendar_ytd":
        multiplier = 0.92;
        break;
      case "cumulative":
        multiplier = 1.1;
        break;
      case "all_months":
        multiplier = 1;
        break;
      default:
        multiplier = 1;
    }

    updateToken(tokenId, { timeOption, multiplier });
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2 items-start">
        {/* Input Container */}
        <div className="flex-1">
          <div
            className={cn(
              "flex flex-wrap items-center gap-0 border p-[5px] pr-[10px] min-h-[25px] bg-white shadow-sm transition-colors",
              error
                ? "border-red-400"
                : "border-gray-300 focus-within:border-purple-600"
            )}
          >
            {tokens.map((token) => (
              <span key={token.id} className="flex items-center mr-0">
                {token.type === "operator" ? (
                  <span className="px-[5px] h-[22px] flex items-center text-gray-700 text-xs">
                    {token.value}
                  </span>
                ) : token.type === "number" ? (
                  <span className="px-[5px] h-[22px] flex items-center text-gray-700 text-xs">
                    {token.value}
                  </span>
                ) : (
                  <Tag
                    label={token.name || "Unnamed Variable"}
                    onTimeSelect={(timeOption) =>
                      handleMonthSelect(token.id, timeOption)
                    }
                  />
                )}
              </span>
            ))}

            <input
              ref={inputRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="outline-none flex-1 min-w-[100px] h-[25px] text-xs text-gray-800"
              placeholder="Enter a formula"
            />
          </div>

          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

          {/* Suggestions Dropdown */}
          {isDropdownOpen && formattedSuggestions.length > 0 && (
            <SuggestionsDropdown
              suggestions={formattedSuggestions}
              highlightedIndex={highlightedIndex}
              onSelect={handleSuggestionClick}
            />
          )}
        </div>

        {/* Result Input */}
        <div className="w-[200px]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">=</span>
            <div className="flex-1 border p-[5px] pr-[10px] min-h-[25px] bg-white shadow-sm">
              <input
                type="text"
                readOnly
                value={evaluateFormula(tokens)}
                className="outline-none w-full h-[25px] text-xs text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
