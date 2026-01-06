import React from "react";
import { Unit as UnitType } from "@/data/kitchenLayout";
import Zone from "./Zone";
import { useInventory } from "@/context/InventoryContext";
import { Package } from "lucide-react";

interface UnitProps {
  unit: UnitType;
  onSelectZone: (zoneLabel: string) => void;
  isSelected: boolean;
}

export default function Unit({ unit, onSelectZone, isSelected }: UnitProps) {
  const { inventory } = useInventory();

  const getTotalItems = () => {
    return unit.zones.reduce((total, zone) => {
      const zoneId = `${unit.id}-${zone}`;
      return total + (inventory[zoneId]?.length || 0);
    }, 0);
  };

  const totalItems = getTotalItems();

  return (
    <div 
      className={`rounded-xl border bg-background p-4 transition-all duration-200 ${
        isSelected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-muted-foreground/30"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">{unit.label}</h3>
        </div>
        {totalItems > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {totalItems} items
          </span>
        )}
      </div>
      <div className="space-y-2">
        {unit.zones.map(zone => (
          <Zone 
            key={zone} 
            unitId={unit.id}
            label={zone} 
            onClick={() => onSelectZone(zone)}
          />
        ))}
      </div>
    </div>
  );
}
