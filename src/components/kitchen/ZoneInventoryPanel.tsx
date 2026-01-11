import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Package, Calendar, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type InventoryItem = {
  id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  category?: keyof typeof categoryIcons;
  expiry_date?: string | null;
  low_stock_threshold?: number | null;
  notes?: string | null;
};

type KitchenZone = {
  id: string;
  name: string;
  zone_type?: string | null;
  notes?: string | null;
};

type ZoneInventoryPanelProps = {
  zone: KitchenZone | null;
  items: InventoryItem[];
  onClose: () => void;
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (item: InventoryItem) => void;
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

const categoryColors: Record<string, string> = {
  food: "bg-green-50 text-green-700 border-green-200",
  cookware: "bg-orange-50 text-orange-700 border-orange-200",
  utensils: "bg-blue-50 text-blue-700 border-blue-200",
  appliances: "bg-purple-50 text-purple-700 border-purple-200",
  dishes: "bg-pink-50 text-pink-700 border-pink-200",
  storage: "bg-gray-50 text-gray-700 border-gray-200",
  cleaning: "bg-cyan-50 text-cyan-700 border-cyan-200",
  spices: "bg-red-50 text-red-700 border-red-200",
  beverages: "bg-amber-50 text-amber-700 border-amber-200",
  other: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function ZoneInventoryPanel({
  zone,
  items,
  onClose,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: ZoneInventoryPanelProps) {
  if (!zone) return null;

  const getExpiryStatus = (expiryDate?: string | null) => {
    if (!expiryDate) return null;
    const days = differenceInDays(parseISO(expiryDate), new Date());
    if (days < 0) return { status: "expired", color: "bg-red-100 text-red-700", text: "Expired" };
    if (days <= 3) return { status: "critical", color: "bg-red-100 text-red-700", text: `${days}d left` };
    if (days <= 7) return { status: "warning", color: "bg-amber-100 text-amber-700", text: `${days}d left` };
    return { status: "ok", color: "bg-green-100 text-green-700", text: format(parseISO(expiryDate), "MMM d") };
  };

  const isLowStock = (item: InventoryItem) => {
    if (item.low_stock_threshold == null) return false;
    if (item.quantity == null) return false;
    return item.quantity <= item.low_stock_threshold;
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{zone.name}</h2>
            <p className="text-sm text-gray-500 mt-1 capitalize">{zone.zone_type?.replace("_", " ")}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Package className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">{items.length} items</span>
          </div>
          <Button onClick={onAddItem} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No items yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first item to this zone</p>
            <Button onClick={onAddItem} variant="outline" className="mt-4 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item, index) => {
                const expiry = getExpiryStatus(item.expiry_date);
                const lowStock = isLowStock(item);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-amber-200 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          categoryColors[item.category || "other"]
                        }`}
                      >
                        {categoryIcons[item.category || "other"]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          {lowStock && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.quantity != null && (
                            <span className="text-sm text-gray-500">
                              {item.quantity} {item.unit || "pcs"}
                            </span>
                          )}
                          <Badge variant="outline" className={`text-xs ${categoryColors[item.category || "other"]}`}>
                            {item.category || "other"}
                          </Badge>
                        </div>

                        {expiry && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className={`text-xs px-2 py-0.5 rounded-full ${expiry.color}`}>{expiry.text}</span>
                          </div>
                        )}

                        {item.notes && <p className="text-xs text-gray-400 mt-2 line-clamp-1">{item.notes}</p>}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditItem(item)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => onDeleteItem(item)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      {zone.notes && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Note:</span> {zone.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
}
