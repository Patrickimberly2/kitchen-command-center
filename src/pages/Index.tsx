import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, RefreshCw, ChefHat } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "sonner";

import { base44 } from "@/api/base44Client";
import Kitchen3DScene from "@/components/kitchen/Kitchen3DScene";
import ZoneInventoryPanel from "@/components/kitchen/ZoneInventoryPanel";
import ItemFormModal from "@/components/kitchen/ItemFormModal";
import SearchPanel from "@/components/kitchen/SearchPanel";
import StatsCards from "@/components/kitchen/StatsCards";
import ZoneSetupModal from "@/components/kitchen/ZoneSetupModal";
import { Button } from "@/components/ui/button";

type KitchenZone = {
  id: string;
  name: string;
  description?: string | null;
};

type InventoryItem = {
  id: string;
  zone_id: string;
  name: string;
  quantity: number;
  low_stock_threshold?: number | null;
  expiry_date?: string | null;
};

type ZonePayload = Record<string, unknown>;
type ItemPayload = Record<string, unknown>;

export default function Kitchen() {
  const queryClient = useQueryClient();
  const [selectedZone, setSelectedZone] = useState<KitchenZone | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingZone, setEditingZone] = useState<KitchenZone | null>(null);

  const { data: zones = [], isLoading: zonesLoading } = useQuery<KitchenZone[]>({
    queryKey: ["kitchenZones"],
    queryFn: () => base44.entities.KitchenZone.list(),
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<InventoryItem[]>({
    queryKey: ["inventoryItems"],
    queryFn: () => base44.entities.InventoryItem.list(),
  });

  const createZoneMutation = useMutation({
    mutationFn: (data: ZonePayload) => base44.entities.KitchenZone.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchenZones"] });
      toast.success("Zone added successfully");
      setShowZoneModal(false);
      setEditingZone(null);
    },
  });

  const updateZoneMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZonePayload }) =>
      base44.entities.KitchenZone.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchenZones"] });
      toast.success("Zone updated successfully");
      setShowZoneModal(false);
      setEditingZone(null);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: (data: ItemPayload) => base44.entities.InventoryItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      toast.success("Item added successfully");
      setShowItemModal(false);
      setEditingItem(null);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ItemPayload }) =>
      base44.entities.InventoryItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      toast.success("Item updated successfully");
      setShowItemModal(false);
      setEditingItem(null);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => base44.entities.InventoryItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      toast.success("Item deleted");
    },
  });

  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.zone_id] = (counts[item.zone_id] || 0) + 1;
    });
    return counts;
  }, [items]);

  const zoneItems = useMemo(() => {
    if (!selectedZone) return [] as InventoryItem[];
    return items.filter((item) => item.zone_id === selectedZone.id);
  }, [items, selectedZone]);

  const stats = useMemo(() => {
    const expiringItems = items.filter((item) => {
      if (!item.expiry_date) return false;
      const days = differenceInDays(parseISO(item.expiry_date), new Date());
      return days >= 0 && days <= 7;
    }).length;

    const lowStockItems = items.filter(
      (item) => item.low_stock_threshold != null && item.quantity <= item.low_stock_threshold,
    ).length;

    return {
      totalItems: items.length,
      expiringItems,
      lowStockItems,
      totalZones: zones.length,
    };
  }, [items, zones]);

  const handleSelectZone = (zone: KitchenZone) => {
    setSelectedZone(zone);
    setShowSearch(false);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleSaveItem = async (data: ItemPayload) => {
    if (!selectedZone) return;
    if (editingItem) {
      await updateItemMutation.mutateAsync({ id: editingItem.id, data });
    } else {
      await createItemMutation.mutateAsync({ ...data, zone_id: selectedZone.id });
    }
  };

  const handleSaveZone = async (data: ZonePayload) => {
    if (editingZone) {
      await updateZoneMutation.mutateAsync({ id: editingZone.id, data });
    } else {
      await createZoneMutation.mutateAsync(data);
    }
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setShowZoneModal(true);
  };

  const isLoading = zonesLoading || itemsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kitchen Command</h1>
                <p className="text-sm text-gray-500">3D Inventory &amp; Organization</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch((prev) => !prev)}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddZone} className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Zone</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["kitchenZones"] });
                  queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
                }}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <StatsCards {...stats} />

        <div className="mt-6 relative">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="h-[500px] md:h-[600px] relative">
              {zones.length === 0 && !zonesLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <ChefHat className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Your Kitchen!</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    Start by adding storage zones to create your 3D kitchen layout
                  </p>
                  <Button onClick={handleAddZone} className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Zone
                  </Button>
                </div>
              ) : (
                <Kitchen3DScene
                  zones={zones}
                  selectedZone={selectedZone}
                  onSelectZone={handleSelectZone}
                  itemCounts={itemCounts}
                />
              )}

              <AnimatePresence>
                {showSearch && (
                  <SearchPanel
                    items={items}
                    zones={zones}
                    onSelectZone={handleSelectZone}
                    onClose={() => setShowSearch(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {zones.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  🖱️ Click on any zone to view/manage items • Drag to rotate • Scroll to zoom
                </p>
              </div>
            )}
          </div>
        </div>

        {zones.length > 0 && (
          <div className="mt-6 md:hidden">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Storage Zones</h3>
            <div className="grid grid-cols-2 gap-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleSelectZone(zone)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedZone?.id === zone.id
                      ? "bg-amber-100 border-amber-300"
                      : "bg-white border-gray-100 hover:border-amber-200"
                  } border`}
                >
                  <p className="font-medium text-gray-900 truncate text-sm">{zone.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{itemCounts[zone.id] || 0} items</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedZone && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setSelectedZone(null)}
            />
            <ZoneInventoryPanel
              zone={selectedZone}
              items={zoneItems}
              onClose={() => setSelectedZone(null)}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </>
        )}
      </AnimatePresence>

      <ItemFormModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
        zoneName={selectedZone?.name}
      />

      <ZoneSetupModal
        isOpen={showZoneModal}
        onClose={() => {
          setShowZoneModal(false);
          setEditingZone(null);
        }}
        onSave={handleSaveZone}
        zone={editingZone}
      />
    </div>
  );
}
