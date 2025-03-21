import React from "react";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import type { Suggestion } from "@/types/suggestions";

interface SuggestionsDropdownProps {
  suggestions: Suggestion[];
  highlightedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  suggestions,
  highlightedIndex,
  onSelect,
}) => {
  return (
    <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 z-50 max-h-[300px] overflow-auto">
      <div className="py-0.5">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              "w-full px-4 py-2.5 text-left flex items-start gap-3 group cursor-pointer",
              "hover:bg-purple-50",
              highlightedIndex === index && "bg-purple-100"
            )}
          >
            <Hash
              className={cn(
                "w-3.5 h-3.5 text-gray-400 mt-[3px] flex-shrink-0",
                highlightedIndex === index && "text-purple-500"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline">
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    highlightedIndex === index
                      ? "text-purple-700"
                      : "text-gray-800"
                  )}
                >
                  {suggestion.name}
                </span>
              </div>
              {suggestion.category && (
                <div
                  className={cn(
                    "text-[12px] mt-0.5 leading-snug",
                    highlightedIndex === index
                      ? "text-purple-500"
                      : "text-gray-500"
                  )}
                >
                  {suggestion.category}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsDropdown;
