import React, { useState } from "react";
import { kitchenLayout, Unit as UnitType } from "@/data/kitchenLayout";
import Unit from "./Unit";
import InventoryPanel from "./InventoryPanel";
import AuditPanel from "./AuditPanel";
import { useInventory } from "@/context/InventoryContext";
import { Refrigerator, UtensilsCrossed, LayoutGrid } from "lucide-react";

export default function KitchenView() {
  const [selectedZone, setSelectedZone] = useState<{ unitId: string; zoneLabel: string } | null>(null);
  const { audit } = useInventory();

  const getAreaIcon = (areaId: string) => {
    if (areaId.includes("WALL-1")) return <Refrigerator className="h-5 w-5" />;
    if (areaId.includes("WALL-2")) return <UtensilsCrossed className="h-5 w-5" />;
    return <LayoutGrid className="h-5 w-5" />;
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
          <AuditPanel issues={audit} />
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {kitchenLayout.map(area => (
              <section key={area.areaId} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
