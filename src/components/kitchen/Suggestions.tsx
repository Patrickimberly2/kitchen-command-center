import React from "react";
import { getSuggestions } from "@/ai/rulesEngine";
import { Sparkles } from "lucide-react";

interface SuggestionsProps {
  zoneLabel: string;
  onSelect: (suggestion: string) => void;
}

export default function Suggestions({ zoneLabel, onSelect }: SuggestionsProps) {
  const suggestions = getSuggestions(zoneLabel);

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-lg bg-primary/5 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">AI Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(suggestion => (
          <button
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            className="rounded-full border border-primary/20 bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/10"
          >
            + {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
