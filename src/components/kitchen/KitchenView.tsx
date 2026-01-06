import React, { useState, Suspense } from "react";
import { kitchenLayout, Unit as UnitType } from "@/data/kitchenLayout";
import Unit from "./Unit";
import InventoryPanel from "./InventoryPanel";
import AuditPanel from "./AuditPanel";
import Kitchen3D from "./Kitchen3D";
import { useInventory } from "@/context/InventoryContext";
import { Refrigerator, UtensilsCrossed, LayoutGrid, Box, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function KitchenView() {
  const [selectedZone, setSelectedZone] = useState<{ unitId: string; zoneLabel: string } | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "list">("3d");
  const { audit } = useInventory();

  const getAreaIcon = (areaId: string) => {
    if (areaId.includes("WALL-1")) return <Refrigerator className="h-5 w-5" />;
    if (areaId.includes("WALL-2")) return <UtensilsCrossed className="h-5 w-5" />;
    return <LayoutGrid className="h-5 w-5" />;
  };

  const handleUnitSelect = (unitId: string) => {
    // Find the unit and select its first zone
    for (const area of kitchenLayout) {
      const unit = area.units.find(u => u.id === unitId);
      if (unit) {
        setSelectedZone({ unitId: unit.id, zoneLabel: unit.zones[0] });
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kitchen Inventory</h1>
              <p className="text-sm text-muted-foreground">Organize your space</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "3d" | "list")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="3d" className="gap-2">
                  <Box className="h-4 w-4" />
                  <span className="hidden sm:inline">3D View</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <AuditPanel issues={audit} />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {viewMode === "3d" && (
              <section className="animate-fade-in">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Kitchen Floor Plan</h2>
                    <p className="text-sm text-muted-foreground">Click on a cabinet to manage its inventory</p>
                  </div>
                </div>
                <Suspense fallback={
                  <div className="flex h-[400px] items-center justify-center rounded-2xl border border-border bg-card">
                    <div className="text-muted-foreground">Loading 3D view...</div>
                  </div>
                }>
                  <Kitchen3D 
                    selectedUnitId={selectedZone?.unitId || null}
                    onSelectUnit={handleUnitSelect}
                  />
                </Suspense>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Drag to rotate • Scroll to zoom
                </p>
              </section>
            )}

            {kitchenLayout.map(area => (
              <section 
                key={area.areaId} 
                className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all ${
                  viewMode === "3d" ? "opacity-80 hover:opacity-100" : ""
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    {getAreaIcon(area.areaId)}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{area.label}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {area.units.map((unit: UnitType) => (
                    <Unit 
                      key={unit.id} 
                      unit={unit} 
                      onSelectZone={(zoneLabel) => setSelectedZone({ unitId: unit.id, zoneLabel })}
                      isSelected={selectedZone?.unitId === unit.id}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <InventoryPanel 
              selectedZone={selectedZone} 
              onClose={() => setSelectedZone(null)}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
