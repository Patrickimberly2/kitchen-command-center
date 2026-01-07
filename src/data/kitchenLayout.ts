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

// Real kitchen geometry - authoritative layout
export const kitchenLayout: Area[] = [
  { 
    areaId: "WALL-1", 
    label: "Fridge & Pantry Wall", 
    units: [
      // Upright freezer: 31"W × 30"D, single door, 4 door bins
      { id: "FREEZER", label: "Upright Freezer", zones: ["Door Bin 1", "Door Bin 2", "Door Bin 3", "Door Bin 4"] },
      // Tall pantry: 30"W × 32"D, door, 8 internal shelves
      { id: "PANTRY", label: "Tall Pantry", zones: ["Shelf 1", "Shelf 2", "Shelf 3", "Shelf 4", "Shelf 5", "Shelf 6", "Shelf 7", "Shelf 8"] },
      // Main fridge with zones
      { id: "FRIDGE", label: "Main Fridge", zones: ["Top Shelf Left", "Top Shelf Right", "Full Shelf", "Drawer Shelf", "Crisper Left", "Crisper Right", "Deli Drawer", "Freezer Drawer", "Freezer Inner Drawer"] },
      // Above fridge: two separate cabinets
      { id: "FRIDGE-UPPER-L", label: "Above Fridge Left", zones: ["Main"] },
      { id: "FRIDGE-UPPER-R", label: "Above Fridge Right", zones: ["Main"] },
      // Five upper cabinets (15"W each)
      { id: "W1-UPPER-1", label: "Upper Cabinet 1", zones: ["Shared Shelf A"] },
      { id: "W1-UPPER-2", label: "Upper Cabinet 2", zones: ["Shared Shelf A"] },
      { id: "W1-UPPER-3", label: "Upper Cabinet 3", zones: ["Shared Shelf B"] },
      { id: "W1-UPPER-4", label: "Upper Cabinet 4", zones: ["Shared Shelf B"] },
      { id: "W1-UPPER-5", label: "Upper Cabinet 5", zones: ["Shared Shelf B"] },
      // Five connected base cabinets (15"W × 31"D)
      { id: "W1-BASE-1", label: "Base Cabinet 1", zones: ["Main"] },
      { id: "W1-BASE-2", label: "Base Cabinet 2", zones: ["Main"] },
      { id: "W1-BASE-3", label: "Base Cabinet 3", zones: ["Main"] },
      { id: "W1-BASE-4", label: "Base Cabinet 4", zones: ["Main"] },
      { id: "W1-BASE-5", label: "Base Cabinet 5", zones: ["Main"] },
    ]
  },
  { 
    areaId: "WALL-2", 
    label: "Sink & Stove Wall", 
    units: [
      // Two 12"W upper cabinets (1 shelf each)
      { id: "W2-UPPER-L1", label: "Upper Left 1", zones: ["Shelf"] },
      { id: "W2-UPPER-L2", label: "Upper Left 2", zones: ["Shelf"] },
      // 3-drawer stack (15"W × 18"D)
      { id: "W2-DRAWERS", label: "Drawer Stack", zones: ["Top Drawer", "Middle Drawer", "Bottom Drawer (Deep)"] },
      // Three base cabinets to left of stove
      { id: "W2-BASE-L1", label: "Base Left 1", zones: ["Main"] },
      { id: "W2-BASE-L2", label: "Base Left 2", zones: ["Main"] },
      { id: "W2-BASE-L3", label: "Base Left 3", zones: ["Main"] },
      // Stove (appliance, no storage)
      { id: "STOVE", label: "Stove", zones: [] },
      // Built-in dishwasher
      { id: "DISHWASHER", label: "Dishwasher", zones: ["Main"] },
      // Double-bowl sink with 2-door base cabinet
      { id: "SINK", label: "Sink Cabinet", zones: ["Left Door", "Right Door"] },
      // Above microwave: two half-width upper cabinets
      { id: "W2-MICRO-UPPER-L", label: "Above Microwave Left", zones: ["Main"] },
      { id: "W2-MICRO-UPPER-R", label: "Above Microwave Right", zones: ["Main"] },
      // Two upper cabinets above sink area
      { id: "W2-UPPER-R1", label: "Upper Right 1", zones: ["Shelf 1", "Shelf 2"] },
      { id: "W2-UPPER-R2", label: "Upper Right 2", zones: ["Shelf 1", "Shelf 2"] },
    ]
  },
  { 
    areaId: "PEN-1", 
    label: "Peninsula 1 – Bar Wall", 
    units: [
      // Three base cabinets, no internal dividers, doors face kitchen
      { id: "PEN1-BASE-1", label: "Peninsula 1 Cabinet 1", zones: ["Main"] },
      { id: "PEN1-BASE-2", label: "Peninsula 1 Cabinet 2", zones: ["Main"] },
      { id: "PEN1-BASE-3", label: "Peninsula 1 Cabinet 3", zones: ["Main"] },
    ]
  },
  { 
    areaId: "PEN-2", 
    label: "Peninsula 2 – Display Peninsula", 
    units: [
      // Three base cabinets
      { id: "PEN2-BASE-1", label: "Peninsula 2 Cabinet 1", zones: ["Main"] },
      { id: "PEN2-BASE-2", label: "Peninsula 2 Cabinet 2", zones: ["Main"] },
      { id: "PEN2-BASE-3", label: "Peninsula 2 Cabinet 3", zones: ["Main"] },
      // Four upper cabinets (double-sided doors)
      { id: "PEN2-UPPER-1", label: "Display Cabinet 1", zones: ["Main"] },
      { id: "PEN2-UPPER-2", label: "Display Cabinet 2", zones: ["Main"] },
      { id: "PEN2-UPPER-3", label: "Display Cabinet 3", zones: ["Main"] },
      { id: "PEN2-UPPER-4", label: "Display Cabinet 4", zones: ["Main"] },
    ]
  },
  { 
    areaId: "ISLAND", 
    label: "Island", 
    units: [
      // Two base cabinets side-by-side (15"W × 31"D each)
      { id: "ISL-1", label: "Island Cabinet 1", zones: ["Main"] },
      { id: "ISL-2", label: "Island Cabinet 2", zones: ["Main"] },
    ]
  }
];

// Geometry constants for 3D rendering (in scene units, proportional to inches)
// 1 scene unit = ~12 inches for easier calculation
export const GEOMETRY = {
  // Wall 1 units
  FREEZER: { width: 2.58, depth: 2.5, height: 5.5, x: -7, z: -5 },
  PANTRY: { width: 2.5, depth: 2.67, height: 6, x: -4.2, z: -5 },
  FRIDGE: { width: 3, depth: 2.67, height: 5.5, x: -1, z: -5 },
  FRIDGE_UPPER_L: { width: 1.25, depth: 1, height: 1.25, x: -1.75, z: -5, y: 5.8 },
  FRIDGE_UPPER_R: { width: 1.25, depth: 1, height: 1.25, x: -0.25, z: -5, y: 5.8 },
  W1_UPPER_ROW: { width: 1.25, depth: 1, height: 2.5, y: 4.5 },
  W1_BASE_ROW: { width: 1.25, depth: 2.58, height: 2.5 },
  
  // Wall 2 units
  W2_UPPER_L: { width: 1, depth: 1, height: 2.5 },
  W2_DRAWERS: { width: 1.25, depth: 1.5, height: 2.5 },
  SINK: { width: 3, depth: 2, height: 2.5 },
  DISHWASHER: { width: 2, depth: 2, height: 2.5 },
  STOVE: { width: 2.5, depth: 2, height: 0.2 },
  MICROWAVE: { width: 2.5, depth: 1.5, height: 1.2 },
  W2_BASE_R: { width: 1.5, depth: 2.58, height: 2.5 },
  W2_UPPER_R: { width: 1.25, depth: 1, height: 2.5 },
  
  // Peninsulas
  PEN_BASE: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN2_UPPER: { width: 1.25, depth: 1, height: 2 },
  
  // Island
  ISLAND: { width: 1.25, depth: 2.58, height: 2.5 },
};
