import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Package, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type InventoryItem = {
  id: string;
  name: string;
  zone_id: string;
  quantity?: number | null;
  unit?: string | null;
  category?: string | null;
  notes?: string | null;
};

type KitchenZone = {
  id: string;
  name: string;
};

type SearchPanelProps = {
  items: InventoryItem[];
  zones: KitchenZone[];
  onSelectZone: (zone: KitchenZone) => void;
  onClose: () => void;
};

const categoryIcons: Record<string, string> = {
  food: "🍎",
  cookware: "🍳",
  utensils: "🥄",
  appliances: "⚡",
  dishes: "🍽️",
  storage: "📦",
  cleaning: "🧹",
  spices: "🌶️",
  beverages: "🥤",
  other: "📋",
};

export default function SearchPanel({ items, zones, onSelectZone, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const zonesMap = useMemo(() => {
    const map: Record<string, KitchenZone> = {};
    zones.forEach((zone) => {
      map[zone.id] = zone;
    });
    return map;
  }, [zones]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [] as InventoryItem[];
    const query = searchQuery.toLowerCase();
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query),
      )
      .slice(0, 20);
  }, [items, searchQuery]);

  const handleItemClick = (item: InventoryItem) => {
    const zone = zonesMap[item.zone_id];
    if (zone) {
      onSelectZone(zone);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-40"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for items in your kitchen..."
              className="pl-12 pr-12 py-3 text-base rounded-xl border-gray-200 focus:border-amber-400 focus:ring-amber-400"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {searchQuery.trim() && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <ScrollArea className="max-h-80">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No items found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredItems.map((item, index) => {
                      const zone = zonesMap[item.zone_id];
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleItemClick(item)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors text-left group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                            {categoryIcons[item.category || "other"]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500 truncate">{zone?.name || "Unknown location"}</span>
                              {item.quantity && (
                                <Badge variant="outline" className="text-xs">
                                  {item.quantity} {item.unit || "pcs"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
