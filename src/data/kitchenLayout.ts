export interface Zone {
  label: string;
}

export interface Unit {
  id: string;
  label: string;
  zones: string[];
}

export interface Area {
  areaId: string;
  label: string;
  units: Unit[];
}

export const kitchenLayout: Area[] = [
  { 
    areaId: "WALL-1", 
    label: "Fridge & Pantry", 
    units: [
      { id: "PANTRY", label: "Pantry", zones: ["Shelf 1", "Shelf 2", "Shelf 3"] },
      { id: "FREEZER", label: "Freezer", zones: ["Top Drawer", "Bottom Drawer"] }
    ]
  },
  { 
    areaId: "WALL-2", 
    label: "Sink & Stove", 
    units: [
      { id: "DRAWERS", label: "Drawer Stack", zones: ["Top Drawer", "Bottom Drawer"] },
      { id: "SINK", label: "Sink Cabinet", zones: ["Left Door", "Right Door"] }
    ]
  },
  { 
    areaId: "PEN-1", 
    label: "Peninsula 1", 
    units: [
      { id: "PEN1", label: "Base Cabinet", zones: ["Main"] }
    ]
  },
  { 
    areaId: "PEN-2", 
    label: "Peninsula 2", 
    units: [
      { id: "PEN2", label: "Drawer Stack", zones: ["Top Drawer", "Bottom Drawer"] }
    ]
  },
  { 
    areaId: "ISLAND", 
    label: "Island", 
    units: [
      { id: "ISL", label: "Island Cabinet", zones: ["Main"] }
    ]
  }
];
