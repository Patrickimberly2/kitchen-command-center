import React from "react";
import { useInventory } from "@/context/InventoryContext";
import { ChevronRight } from "lucide-react";

interface ZoneProps {
  unitId: string;
  label: string;
  onClick: () => void;
}

export default function Zone({ unitId, label, onClick }: ZoneProps) {
  const { inventory } = useInventory();
  const zoneId = `${unitId}-${label}`;
  const items = inventory[zoneId] || [];

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 text-left transition-all hover:bg-muted"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {items.length > 0 && (
          <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
            {items.length}
          </span>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
