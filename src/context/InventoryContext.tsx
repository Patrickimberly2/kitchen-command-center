import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { z } from "zod";
import { auditInventory, AuditIssue } from "../ai/rulesEngine";

const KEY = "kitchen_inventory_data";

// Schema validation for inventory data
const InventoryItemSchema = z.object({
  id: z.number(),
  title: z.string(),
});

const InventoryDataSchema = z.record(z.array(InventoryItemSchema));

interface InventoryItem {
  id: number;
  title: string;
}

interface InventoryData {
  [zoneId: string]: InventoryItem[];
}

interface InventoryContextType {
  inventory: InventoryData;
  addItem: (zoneId: string, title: string) => void;
  removeItem: (zoneId: string, id: number) => void;
  audit: AuditIssue[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Safe localStorage parser with schema validation
function loadInventoryFromStorage(): InventoryData {
  try {
    const rawData = localStorage.getItem(KEY);
    if (!rawData) return {};
    
    const parsed = JSON.parse(rawData);
    const validated = InventoryDataSchema.parse(parsed);
    return validated as InventoryData;
  } catch (error) {
    console.error("Invalid inventory data in localStorage, resetting:", error);
    localStorage.removeItem(KEY);
    return {};
  }
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryData>({});
  const [audit, setAudit] = useState<AuditIssue[]>([]);

  useEffect(() => {
    const data = loadInventoryFromStorage();
    setInventory(data);
    setAudit(auditInventory(data));
  }, []);

  const sync = (updated: InventoryData) => {
    setInventory(updated);
    setAudit(auditInventory(updated));
    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  const addItem = (zoneId: string, title: string) => {
    const updated = {
      ...inventory,
      [zoneId]: [...(inventory[zoneId] || []), { id: Date.now(), title }]
    };
    sync(updated);
  };

  const removeItem = (zoneId: string, id: number) => {
    const updated = {
      ...inventory,
      [zoneId]: inventory[zoneId].filter(i => i.id !== id)
    };
    sync(updated);
  };

  return (
    <InventoryContext.Provider value={{ inventory, addItem, removeItem, audit }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
