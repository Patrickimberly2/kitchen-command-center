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

// ---------- LAYOUT ----------

export const kitchenLayout: Area[] = [
  {
    areaId: "WALL-1",
    label: "Fridge & Pantry Wall",
    units: [
      {
        id: "FREEZER",
        label: "Upright Freezer",
        zones: [
          "FreezerShelf1",
          "FreezerShelf2",
          "FreezerShelf3",
          "FreezerShelf4",
          "FreezerBottomBin",
          "FreezerDoorBin1",
          "FreezerDoorBin2",
          "FreezerDoorBin3",
          "FreezerDoorBin4",
        ],
      },
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
      { id: "FRIDGE-UPPER-L", label: "Above Fridge Left", zones: ["Main"] },
      { id: "FRIDGE-UPPER-R", label: "Above Fridge Right", zones: ["Main"] },
      {
        id: "W1-UPPER-1",
        label: "Upper Cabinet 1",
        zones: ["W1-UPPER-1-Top", "W1-UPPER-1-Bottom"],
      },
      {
        id: "W1-UPPER-2",
        label: "Upper Cabinet 2",
        zones: ["W1-UPPER-2-Top", "W1-UPPER-2-Bottom"],
      },
      {
        id: "W1-UPPER-3",
        label: "Upper Cabinet 3",
        zones: ["W1-UPPER-3-Top", "W1-UPPER-3-Bottom"],
      },
      {
        id: "W1-UPPER-4",
        label: "Upper Cabinet 4",
        zones: ["W1-UPPER-4-Top", "W1-UPPER-4-Bottom"],
      },
      {
        id: "W1-UPPER-5",
        label: "Upper Cabinet 5",
        zones: ["W1-UPPER-5-Top", "W1-UPPER-5-Bottom"],
      },
      {
        id: "W1-BASE-1",
        label: "Base Cabinet 1",
        zones: ["W1-BASE-1-Drawer", "W1-BASE-1-Door"],
      },
      {
        id: "W1-BASE-2",
        label: "Base Cabinet 2",
        zones: ["W1-BASE-2-Drawer", "W1-BASE-2-Door"],
      },
      {
        id: "W1-BASE-3",
        label: "Base Cabinet 3",
        zones: ["W1-BASE-3-Drawer", "W1-BASE-3-Door"],
      },
      {
        id: "W1-BASE-4",
        label: "Base Cabinet 4",
        zones: ["W1-BASE-4-Drawer", "W1-BASE-4-Door"],
      },
      {
        id: "W1-BASE-5",
        label: "Base Cabinet 5",
        zones: ["W1-BASE-5-Drawer", "W1-BASE-5-Door"],
      },
    ],
  },

  {
    areaId: "WALL-2",
    label: "Sink & Stove Wall",
    units: [
      {
        id: "W2-UPPER-L1",
        label: "Upper Left 1",
        zones: ["W2-UPPER-L1-Top", "W2-UPPER-L1-Bottom"],
      },
      {
        id: "W2-UPPER-L2",
        label: "Upper Left 2",
        zones: ["W2-UPPER-L2-Top", "W2-UPPER-L2-Bottom"],
      },
      {
        id: "W2-DRAWERS",
        label: "Drawer Stack",
        zones: ["W2-DRAWERS-Top", "W2-DRAWERS-Middle", "W2-DRAWERS-Bottom"],
      },
      {
        id: "W2-BASE-L1",
        label: "Base Left 1",
        zones: ["W2-BASE-L1-Drawer", "W2-BASE-L1-Door"],
      },
      {
        id: "W2-BASE-L2",
        label: "Base Left 2",
        zones: ["W2-BASE-L2-Drawer", "W2-BASE-L2-Door"],
      },
      {
        id: "W2-BASE-L3",
        label: "Base Left 3",
        zones: ["W2-BASE-L3-Drawer", "W2-BASE-L3-Door"],
      },
      { id: "STOVE", label: "Stove", zones: [] },
      { id: "DISHWASHER", label: "Dishwasher", zones: ["Main"] },
      {
        id: "W2-DW-UPPER-1",
        label: "Above Dishwasher 1",
        zones: ["W2-DW-UPPER-1-Top", "W2-DW-UPPER-1-Bottom"],
      },
      {
        id: "W2-DW-UPPER-2",
        label: "Above Dishwasher 2",
        zones: ["W2-DW-UPPER-2-Top", "W2-DW-UPPER-2-Bottom"],
      },
      {
        id: "SINK",
        label: "Sink Cabinet",
        zones: ["SINK-LeftDoor", "SINK-RightDoor"],
      },
      {
        id: "W2-MICRO-UPPER-L",
        label: "Above Microwave Left",
        zones: ["Main"],
      },
      {
        id: "W2-MICRO-UPPER-R",
        label: "Above Microwave Right",
        zones: ["Main"],
      },
      {
        id: "W2-UPPER-R1",
        label: "Upper Right 1",
        zones: ["W2-UPPER-R1-Top", "W2-UPPER-R1-Bottom"],
      },
      {
        id: "W2-UPPER-R2",
        label: "Upper Right 2",
        zones: ["W2-UPPER-R2-Top", "W2-UPPER-R2-Bottom"],
      },
      {
        id: "W2-BASE-R1",
        label: "Base Right 1",
        zones: ["W2-BASE-R1-Drawer", "W2-BASE-R1-Door"],
      },
    ],
  },

  {
    areaId: "PEN-1",
    label: "Peninsula 1 – Bar Wall",
    units: [
      {
        id: "PEN1-BASE-1",
        label: "Peninsula 1 Cabinet 1",
        zones: ["PEN1-BASE-1-Drawer", "PEN1-BASE-1-Door"],
      },
      {
        id: "PEN1-BASE-2",
        label: "Peninsula 1 Cabinet 2",
        zones: ["PEN1-BASE-2-Drawer", "PEN1-BASE-2-Door"],
      },
      {
        id: "PEN1-BASE-3",
        label: "Peninsula 1 Cabinet 3",
        zones: ["PEN1-BASE-3-Drawer", "PEN1-BASE-3-Door"],
      },
      {
        id: "PEN1-UPPER-1",
        label: "PEN1 Upper 1",
        zones: ["PEN1-UPPER-1-Top", "PEN1-UPPER-1-Bottom"],
      },
      {
        id: "PEN1-UPPER-2",
        label: "PEN1 Upper 2",
        zones: ["PEN1-UPPER-2-Top", "PEN1-UPPER-2-Bottom"],
      },
      {
        id: "PEN1-UPPER-3",
        label: "PEN1 Upper 3",
        zones: ["PEN1-UPPER-3-Top", "PEN1-UPPER-3-Bottom"],
      },
      {
        id: "PEN1-UPPER-4",
        label: "PEN1 Upper 4",
        zones: ["PEN1-UPPER-4-Top", "PEN1-UPPER-4-Bottom"],
      },
    ],
  },

  {
    areaId: "PEN-2",
    label: "Peninsula 2 – Display Peninsula",
    units: [
      {
        id: "PEN2-BASE-1",
        label: "Peninsula 2 Cabinet 1",
        zones: ["PEN2-BASE-1-Drawer", "PEN2-BASE-1-Door"],
      },
      {
        id: "PEN2-BASE-2",
        label: "Peninsula 2 Cabinet 2",
        zones: ["PEN2-BASE-2-Drawer", "PEN2-BASE-2-Door"],
      },
      {
        id: "PEN2-BASE-3",
        label: "Peninsula 2 Cabinet 3",
        zones: ["PEN2-BASE-3-Drawer", "PEN2-BASE-3-Door"],
      },
      {
        id: "PEN2-UPPER-1",
        label: "Display Cabinet 1",
        zones: ["PEN2-UPPER-1-Top", "PEN2-UPPER-1-Bottom"],
      },
      {
        id: "PEN2-UPPER-2",
        label: "Display Cabinet 2",
        zones: ["PEN2-UPPER-2-Top", "PEN2-UPPER-2-Bottom"],
      },
      {
        id: "PEN2-UPPER-3",
        label: "Display Cabinet 3",
        zones: ["PEN2-UPPER-3-Top", "PEN2-UPPER-3-Bottom"],
      },
      {
        id: "PEN2-UPPER-4",
        label: "Display Cabinet 4",
        zones: ["PEN2-UPPER-4-Top", "PEN2-UPPER-4-Bottom"],
      },
    ],
  },

  {
    areaId: "ISLAND",
    label: "Island",
    units: [
      { id: "ISL-1", label: "Island Cabinet 1", zones: ["Main"] },
      { id: "ISL-2", label: "Island Cabinet 2", zones: ["Main"] },
    ],
  },
];

// ---------- GEOMETRY (UPPERS CONNECTED) ----------

export const GEOMETRY: Record<
  string,
  { width: number; depth: number; height: number; x?: number; y?: number; z?: number }
> = {
  // Wall 1
  FREEZER: { width: 2.58, depth: 2.5, height: 5.5, x: -7, z: -5 },
  PANTRY: { width: 2.5, depth: 2.67, height: 6, x: -4.2, z: -5 },
  FRIDGE: { width: 3, depth: 2.67, height: 5.5, x: -1, z: -5 },
  "FRIDGE-UPPER-L": { width: 1.25, depth: 1, height: 1.25, x: -1.75, y: 5.8, z: -5 },
  "FRIDGE-UPPER-R": { width: 1.25, depth: 1, height: 1.25, x: -0.25, y: 5.8, z: -5 },

  "W1-UPPER-1": { width: 1.25, depth: 1, height: 2.5, x: 1, y: 4.5, z: -5 },
  "W1-UPPER-2": { width: 1.25, depth: 1, height: 2.5, x: 2.25, y: 4.5, z: -5 },
  "W1-UPPER-3": { width: 1.25, depth: 1, height: 2.5, x: 3.5, y: 4.5, z: -5 },
  "W1-UPPER-4": { width: 1.25, depth: 1, height: 2.5, x: 4.75, y: 4.5, z: -5 },
  "W1-UPPER-5": { width: 1.25, depth: 1, height: 2.5, x: 6, y: 4.5, z: -5 },

  "W1-BASE-1": { width: 1.25, depth: 2.58, height: 2.5, x: 1, z: -5 },
  "W1-BASE-2": { width: 1.25, depth: 2.58, height: 2.5, x: 2.25, z: -5 },
  "W1-BASE-3": { width: 1.25, depth: 2.58, height: 2.5, x: 3.5, z: -5 },
  "W1-BASE-4": { width: 1.25, depth: 2.58, height: 2.5, x: 4.75, z: -5 },
  "W1-BASE-5": { width: 1.25, depth: 2.58, height: 2.5, x: 6, z: -5 },

  // Wall 2 (positions are examples – they were already showing correctly)
  "W2-UPPER-L1": { width: 1, depth: 1, height: 2.5 },
  "W2-UPPER-L2": { width: 1, depth: 1, height: 2.5 },
  "W2-DRAWERS": { width: 1.25, depth: 1.5, height: 2.5 },
  "W2-BASE-L1": { width: 1.25, depth: 2.58, height: 2.5 },
  "W2-BASE-L2": { width: 1.25, depth: 2.58, height: 2.5 },
  "W2-BASE-L3": { width: 1.25, depth: 2.58, height: 2.5 },
  STOVE: { width: 2.5, depth: 2, height: 0.2 },
  DISHWASHER: { width: 2, depth: 2, height: 2.5 },
  "W2-DW-UPPER-1": { width: 1, depth: 1, height: 2.5 },
  "W2-DW-UPPER-2": { width: 1, depth: 1, height: 2.5 },
  SINK: { width: 3, depth: 2, height: 2.5 },
  "W2-MICRO-UPPER-L": { width: 1.25, depth: 1, height: 2 },
  "W2-MICRO-UPPER-R": { width: 1.25, depth: 1, height: 2 },
  "W2-UPPER-R1": { width: 1.25, depth: 1, height: 2.5 },
  "W2-UPPER-R2": { width: 1.25, depth: 1, height: 2.5 },
  "W2-BASE-R1": { width: 1.5, depth: 2.58, height: 2.5 },

  // Peninsula 1 – uppers CONNECTED IN A ROW (same y, same depth, sequential x)
  "PEN1-BASE-1": { width: 1.5, depth: 2.58, height: 2.5, x: 0, z: 0 },
  "PEN1-BASE-2": { width: 1.5, depth: 2.58, height: 2.5, x: 1.5, z: 0 },
  "PEN1-BASE-3": { width: 1.5, depth: 2.58, height: 2.5, x: 3, z: 0 },

  "PEN1-UPPER-1": { width: 1.25, depth: 1, height: 2, x: 0, y: 4.5, z: 0 },
  "PEN1-UPPER-2": { width: 1.25, depth: 1, height: 2, x: 1.25, y: 4.5, z: 0 },
  "PEN1-UPPER-3": { width: 1.25, depth: 1, height: 2, x: 2.5, y: 4.5, z: 0 },
  "PEN1-UPPER-4": { width: 1.25, depth: 1, height: 2, x: 3.75, y: 4.5, z: 0 },

  // Peninsula 2 – uppers CONNECTED IN A ROW (same y, same depth, sequential x)
  "PEN2-BASE-1": { width: 1.5, depth: 2.58, height: 2.5, x: 0, z: 3 },
  "PEN2-BASE-2": { width: 1.5, depth: 2.58, height: 2.5, x: 1.5, z: 3 },
  "PEN2-BASE-3": { width: 1.5, depth: 2.58, height: 2.5, x: 3, z: 3 },

  "PEN2-UPPER-1": { width: 1.25, depth: 1, height: 2, x: 0, y: 4.5, z: 3 },
  "PEN2-UPPER-2": { width: 1.25, depth: 1, height: 2, x: 1.25, y: 4.5, z: 3 },
  "PEN2-UPPER-3": { width: 1.25, depth: 1, height: 2, x: 2.5, y: 4.5, z: 3 },
  "PEN2-UPPER-4": { width: 1.25, depth: 1, height: 2, x: 3.75, y: 4.5, z: 3 },

  // Island
  "ISL-1": { width: 1.25, depth: 2.58, height: 2.5, x: 0, z: -1 },
  "ISL-2": { width: 1.25, depth: 2.58, height: 2.5, x: 1.25, z: -1 },
};
