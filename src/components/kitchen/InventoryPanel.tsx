import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import Suggestions from "./Suggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2, PackageOpen } from "lucide-react";

interface InventoryPanelProps {
  selectedZone: { unitId: string; zoneLabel: string } | null;
  onClose: () => void;
}

export default function InventoryPanel({ selectedZone, onClose }: InventoryPanelProps) {
  const { inventory, addItem, removeItem } = useInventory();
  const [newItem, setNewItem] = useState("");

  if (!selectedZone) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6">
        <PackageOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
        <p className="text-center text-muted-foreground">
          Select a zone to view and manage inventory
        </p>
      </div>
    );
  }

  const zoneId = `${selectedZone.unitId}-${selectedZone.zoneLabel}`;
  const items = inventory[zoneId] || [];

  const handleAdd = () => {
    if (newItem.trim()) {
      addItem(zoneId, newItem.trim());
      setNewItem("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addItem(zoneId, suggestion);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold text-foreground">{selectedZone.zoneLabel}</h3>
          <p className="text-sm text-muted-foreground">{selectedZone.unitId}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4 flex gap-2">
          <Input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add new item..."
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Suggestions zoneLabel={selectedZone.zoneLabel} onSelect={handleSuggestionClick} />

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Items ({items.length})
          </h4>
          {items.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No items yet
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map(item => (
                <li 
                  key={item.id} 
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                >
                  <span className="text-sm text-foreground">{item.title}</span>
                  <button
                    onClick={() => removeItem(zoneId, item.id)}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
