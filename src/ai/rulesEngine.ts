export interface AuditIssue {
  level: "error" | "warning" | "info";
  message: string;
}

interface InventoryItem {
  id: number;
  title: string;
}

interface InventoryData {
  [zoneId: string]: InventoryItem[];
}

export function getSuggestions(zoneLabel: string): string[] {
  const map: { [key: string]: string[] } = {
    "Top Drawer": ["Spatula", "Whisk", "Tongs", "Measuring Spoons"],
    "Bottom Drawer": ["Foil", "Plastic Wrap", "Zip Bags", "Parchment Paper"],
    "Shelf 1": ["Cereal", "Oatmeal", "Granola"],
    "Shelf 2": ["Pasta", "Rice", "Quinoa"],
    "Shelf 3": ["Canned Goods", "Soup", "Beans"],
    "Left Door": ["Cleaning Spray", "Sponges", "Dish Soap"],
    "Right Door": ["Trash Bags", "Paper Towels"],
    "Main": ["Pots", "Pans", "Mixing Bowls"]
  };

  return map[zoneLabel] || [];
}

export function auditInventory(inventory: InventoryData): AuditIssue[] {
  const issues: AuditIssue[] = [];

  Object.entries(inventory).forEach(([zoneId, items]) => {
    if (zoneId.toLowerCase().includes("sink") && items.some(i => /food/i.test(i.title))) {
      issues.push({ level: "error", message: `Food stored under sink (${zoneId})` });
    }
    if (items.length > 6) {
      issues.push({ level: "warning", message: `Too many items in ${zoneId}` });
    }
    if (items.length === 0) {
      issues.push({ level: "info", message: `${zoneId} is empty` });
    }
  });

  return issues;
}
