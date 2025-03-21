import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, Settings2Icon } from "lucide-react";

interface TagProps {
  label: string;
  className?: string;
  onTimeSelect?: (timeOption: TimeOption) => void;
}

interface TimeOption {
  type: "single" | "span" | "custom";
  value: string;
  label: string;
}

const SINGLE_MONTH_OPTIONS: TimeOption[] = [
  { type: "single", value: "this_month", label: "this month" },
  { type: "single", value: "previous_month", label: "previous month" },
  { type: "single", value: "1_year_ago", label: "1 year ago" },
];

const TIME_SPAN_OPTIONS: TimeOption[] = [
  { type: "span", value: "last_3_months", label: "last 3 months" },
  { type: "span", value: "last_12_months", label: "last 12 months" },
  { type: "span", value: "calendar_ytd", label: "Calendar ytd" },
  { type: "span", value: "cumulative", label: "cumulative" },
  { type: "span", value: "all_months", label: "all months" },
];

const Tag: React.FC<TagProps> = ({ label, className, onTimeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TimeOption | null>(
    SINGLE_MONTH_OPTIONS[0]
  );

  useEffect(() => {
    if (onTimeSelect && selectedOption) {
      onTimeSelect(selectedOption);
    }
  }, []);

  const handleOptionSelect = (option: TimeOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onTimeSelect?.(option);
  };

  return (
    <div className="inline-flex h-[22px] items-center">
      <div
        className={cn(
          "h-[22px] px-[5px] flex items-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium",
          className
        )}
      >
        {label}
      </div>
      <div className="relative ml-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-[22px] px-[5px] flex items-center rounded-2xl text-xs font-medium transition-colors border border-gray-200 bg-transparent",
            selectedOption ? "text-gray-800" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <span className="truncate">
            {selectedOption?.label || "Select time"}
          </span>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Single Month
              </div>
              {SINGLE_MONTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[13px] flex items-center gap-2 text-gray-900",
                    "hover:bg-gray-100",
                    selectedOption?.value === option.value && "bg-gray-100"
                  )}
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                  {option.label}
                </button>
              ))}

              <div className="mt-3 px-3 py-1 text-[10px] font-medium text-gray-500 uppercase tracking-wider border-t pt-3">
                Time Span
              </div>
              {TIME_SPAN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[13px] flex items-center gap-2 text-gray-900",
                    "hover:bg-gray-100",
                    selectedOption?.value === option.value && "bg-gray-100"
                  )}
                >
                  <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                  {option.label}
                </button>
              ))}

              <button
                onClick={() =>
                  handleOptionSelect({
                    type: "custom",
                    value: "custom",
                    label: "Custom",
                  })
                }
                className={cn(
                  "w-full px-4 py-2 text-left text-[13px] flex items-center gap-2 border-t mt-1 text-gray-900",
                  "hover:bg-gray-100",
                  selectedOption?.value === "custom" && "bg-gray-100"
                )}
              >
                <Settings2Icon className="w-3.5 h-3.5 text-gray-400" />
                Custom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tag;
