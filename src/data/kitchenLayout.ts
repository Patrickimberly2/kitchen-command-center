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
      // Upright freezer: 5 clickable zones (4 shelves + 1 bottom bin)
      {
        id: "FREEZER",
        label: "Upright Freezer",
        zones: ["FreezerShelf1", "FreezerShelf2", "FreezerShelf3", "FreezerShelf4", "FreezerBottomBin"],
      },
      // Tall pantry: 8 shelf zones
      {
        id: "PANTRY",
        label: "Tall Pantry",
        zones: [
          "PantryShelf1",
          "PantryShelf2",
          "PantryShelf3",
          "PantryShelf4",
          "PantryShelf5",
          "PantryShelf6",
          "PantryShelf7",
          "PantryShelf8",
        ],
      },
      // Main fridge with interior zones, left door bins, right door bins
      {
        id: "FRIDGE",
        label: "Main Fridge",
        zones: [
          "FridgeTopShelfLeft",
          "FridgeTopShelfRight",
          "FridgeMiddleShelf",
          "FridgeBottomShelf",
          "CrisperLeft",
          "CrisperRight",
          "FridgeLeftDoorTop",
          "FridgeLeftDoorMiddle",
          "FridgeLeftDoorBottom",
          "FridgeRightDoorTop",
          "FridgeRightDoorMiddle",
          "FridgeRightDoorBottom",
        ],
      },
      // Above fridge: two separate cabinets
      { id: "FRIDGE-UPPER-L", label: "Above Fridge Left", zones: ["Main"] },
      { id: "FRIDGE-UPPER-R", label: "Above Fridge Right", zones: ["Main"] },
      // Five upper cabinets - each split into 2 zones (top front / bottom front)
      { id: "W1-UPPER-1", label: "Upper Cabinet 1", zones: ["W1-UPPER-1-Top", "W1-UPPER-1-Bottom"] },
      { id: "W1-UPPER-2", label: "Upper Cabinet 2", zones: ["W1-UPPER-2-Top", "W1-UPPER-2-Bottom"] },
      { id: "W1-UPPER-3", label: "Upper Cabinet 3", zones: ["W1-UPPER-3-Top", "W1-UPPER-3-Bottom"] },
      { id: "W1-UPPER-4", label: "Upper Cabinet 4", zones: ["W1-UPPER-4-Top", "W1-UPPER-4-Bottom"] },
      { id: "W1-UPPER-5", label: "Upper Cabinet 5", zones: ["W1-UPPER-5-Top", "W1-UPPER-5-Bottom"] },
      // Five base cabinets - each has drawer zone + door zone
      { id: "W1-BASE-1", label: "Base Cabinet 1", zones: ["W1-BASE-1-Drawer", "W1-BASE-1-Door"] },
      { id: "W1-BASE-2", label: "Base Cabinet 2", zones: ["W1-BASE-2-Drawer", "W1-BASE-2-Door"] },
      { id: "W1-BASE-3", label: "Base Cabinet 3", zones: ["W1-BASE-3-Drawer", "W1-BASE-3-Door"] },
      { id: "W1-BASE-4", label: "Base Cabinet 4", zones: ["W1-BASE-4-Drawer", "W1-BASE-4-Door"] },
      { id: "W1-BASE-5", label: "Base Cabinet 5", zones: ["W1-BASE-5-Drawer", "W1-BASE-5-Door"] },
    ],
  },
  {
    areaId: "WALL-2",
    label: "Sink & Stove Wall",
    units: [
      // Two upper cabinets left - each split into 2 zones
      { id: "W2-UPPER-L1", label: "Upper Left 1", zones: ["W2-UPPER-L1-Top", "W2-UPPER-L1-Bottom"] },
      { id: "W2-UPPER-L2", label: "Upper Left 2", zones: ["W2-UPPER-L2-Top", "W2-UPPER-L2-Bottom"] },
      // 3-drawer stack - each drawer is its own clickable zone
      { id: "W2-DRAWERS", label: "Drawer Stack", zones: ["W2-DRAWERS-Top", "W2-DRAWERS-Middle", "W2-DRAWERS-Bottom"] },
      // Three base cabinets to left of stove - each has drawer + door zone
      { id: "W2-BASE-L1", label: "Base Left 1", zones: ["W2-BASE-L1-Drawer", "W2-BASE-L1-Door"] },
      { id: "W2-BASE-L2", label: "Base Left 2", zones: ["W2-BASE-L2-Drawer", "W2-BASE-L2-Door"] },
      { id: "W2-BASE-L3", label: "Base Left 3", zones: ["W2-BASE-L3-Drawer", "W2-BASE-L3-Door"] },
      // Stove (appliance, no storage)
      { id: "STOVE", label: "Stove", zones: [] },
      // Built-in dishwasher
      { id: "DISHWASHER", label: "Dishwasher", zones: ["Main"] },
      // Upper cabinets above dishwasher - 2 new uppers, each split into 2 zones
      { id: "W2-DW-UPPER-1", label: "Above Dishwasher 1", zones: ["W2-DW-UPPER-1-Top", "W2-DW-UPPER-1-Bottom"] },
      { id: "W2-DW-UPPER-2", label: "Above Dishwasher 2", zones: ["W2-DW-UPPER-2-Top", "W2-DW-UPPER-2-Bottom"] },
      // Double-bowl sink with 2-door base cabinet - each door is separate
      { id: "SINK", label: "Sink Cabinet", zones: ["SINK-LeftDoor", "SINK-RightDoor"] },
      // Above microwave: two half-width upper cabinets
      { id: "W2-MICRO-UPPER-L", label: "Above Microwave Left", zones: ["Main"] },
      { id: "W2-MICRO-UPPER-R", label: "Above Microwave Right", zones: ["Main"] },
      // Two upper cabinets above sink area - each split into 2 zones
      { id: "W2-UPPER-R1", label: "Upper Right 1", zones: ["W2-UPPER-R1-Top", "W2-UPPER-R1-Bottom"] },
      { id: "W2-UPPER-R2", label: "Upper Right 2", zones: ["W2-UPPER-R2-Top", "W2-UPPER-R2-Bottom"] },
      // Base cabinet to right of sink - drawer + door zone
      { id: "W2-BASE-R1", label: "Base Right 1", zones: ["W2-BASE-R1-Drawer", "W2-BASE-R1-Door"] },
    ],
  },
  {
    areaId: "PEN-1",
    label: "Peninsula 1 – Bar Wall",
    units: [
      // Three base cabinets - each has drawer + door zone
      { id: "PEN1-BASE-1", label: "Peninsula 1 Cabinet 1", zones: ["PEN1-BASE-1-Drawer", "PEN1-BASE-1-Door"] },
      { id: "PEN1-BASE-2", label: "Peninsula 1 Cabinet 2", zones: ["PEN1-BASE-2-Drawer", "PEN1-BASE-2-Door"] },
      { id: "PEN1-BASE-3", label: "Peninsula 1 Cabinet 3", zones: ["PEN1-BASE-3-Drawer", "PEN1-BASE-3-Door"] },
      // Four upper cabinets above PEN1 bases - each split into 2 zones
      { id: "PEN1-UPPER-1", label: "PEN1 Upper 1", zones: ["PEN1-UPPER-1-Top", "PEN1-UPPER-1-Bottom"] },
      { id: "PEN1-UPPER-2", label: "PEN1 Upper 2", zones: ["PEN1-UPPER-2-Top", "PEN1-UPPER-2-Bottom"] },
      { id: "PEN1-UPPER-3", label: "PEN1 Upper 3", zones: ["PEN1-UPPER-3-Top", "PEN1-UPPER-3-Bottom"] },
      { id: "PEN1-UPPER-4", label: "PEN1 Upper 4", zones: ["PEN1-UPPER-4-Top", "PEN1-UPPER-4-Bottom"] },
    ],
  },
  {
    areaId: "PEN-2",
    label: "Peninsula 2 – Display Peninsula",
    units: [
      // Three base cabinets - each has drawer + door zone
      { id: "PEN2-BASE-1", label: "Peninsula 2 Cabinet 1", zones: ["PEN2-BASE-1-Drawer", "PEN2-BASE-1-Door"] },
      { id: "PEN2-BASE-2", label: "Peninsula 2 Cabinet 2", zones: ["PEN2-BASE-2-Drawer", "PEN2-BASE-2-Door"] },
      { id: "PEN2-BASE-3", label: "Peninsula 2 Cabinet 3", zones: ["PEN2-BASE-3-Drawer", "PEN2-BASE-3-Door"] },
      // Four upper cabinets (double-sided doors) - each split into 2 zones
      { id: "PEN2-UPPER-1", label: "Display Cabinet 1", zones: ["PEN2-UPPER-1-Top", "PEN2-UPPER-1-Bottom"] },
      { id: "PEN2-UPPER-2", label: "Display Cabinet 2", zones: ["PEN2-UPPER-2-Top", "PEN2-UPPER-2-Bottom"] },
      { id: "PEN2-UPPER-3", label: "Display Cabinet 3", zones: ["PEN2-UPPER-3-Top", "PEN2-UPPER-3-Bottom"] },
      { id: "PEN2-UPPER-4", label: "Display Cabinet 4", zones: ["PEN2-UPPER-4-Top", "PEN2-UPPER-4-Bottom"] },
    ],
  },
  {
    areaId: "ISLAND",
    label: "Island",
    units: [
      // Two island cabinets forming one connected block
      { id: "ISL-1", label: "Island Cabinet 1", zones: ["Main"] },
      { id: "ISL-2", label: "Island Cabinet 2", zones: ["Main"] },
    ],
  },
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
