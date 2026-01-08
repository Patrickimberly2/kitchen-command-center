export interface Unit {
  id: string; // must match a GEOMETRY key
  label: string;
  zones: string[]; // each string is a separate clickable zone
}

export interface Area {
  areaId: string;
  label: string;
  units: Unit[];
}

// Real kitchen geometry – authoritative layout
export const kitchenLayout: Area[] = [
  {
    areaId: "WALL-1",
    label: "Fridge & Pantry Wall",
    units: [
      // Upright freezer: 4 shelves + 1 bottom bin
      {
        id: "FREEZER",
        label: "Upright Freezer",
        zones: ["FreezerShelf1", "FreezerShelf2", "FreezerShelf3", "FreezerShelf4", "FreezerBottomBin"],
      },
      // Tall pantry: 8 shelves
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
      // Main fridge: interior shelves + crispers + door bins
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
      // Above‑fridge uppers
      { id: "FRIDGE_UPPER_L", label: "Above Fridge Left", zones: ["FRIDGE_UPPER_L_Main"] },
      { id: "FRIDGE_UPPER_R", label: "Above Fridge Right", zones: ["FRIDGE_UPPER_R_Main"] },

      // Five uppers with inner shelf (top/bottom fronts)
      {
        id: "W1_UPPER_1",
        label: "Upper Cabinet 1",
        zones: ["W1_UPPER_1_Top", "W1_UPPER_1_Bottom"],
      },
      {
        id: "W1_UPPER_2",
        label: "Upper Cabinet 2",
        zones: ["W1_UPPER_2_Top", "W1_UPPER_2_Bottom"],
      },
      {
        id: "W1_UPPER_3",
        label: "Upper Cabinet 3",
        zones: ["W1_UPPER_3_Top", "W1_UPPER_3_Bottom"],
      },
      {
        id: "W1_UPPER_4",
        label: "Upper Cabinet 4",
        zones: ["W1_UPPER_4_Top", "W1_UPPER_4_Bottom"],
      },
      {
        id: "W1_UPPER_5",
        label: "Upper Cabinet 5",
        zones: ["W1_UPPER_5_Top", "W1_UPPER_5_Bottom"],
      },

      // Five bases with drawer + door
      {
        id: "W1_BASE_1",
        label: "Base Cabinet 1",
        zones: ["W1_BASE_1_Drawer", "W1_BASE_1_Door"],
      },
      {
        id: "W1_BASE_2",
        label: "Base Cabinet 2",
        zones: ["W1_BASE_2_Drawer", "W1_BASE_2_Door"],
      },
      {
        id: "W1_BASE_3",
        label: "Base Cabinet 3",
        zones: ["W1_BASE_3_Drawer", "W1_BASE_3_Door"],
      },
      {
        id: "W1_BASE_4",
        label: "Base Cabinet 4",
        zones: ["W1_BASE_4_Drawer", "W1_BASE_4_Door"],
      },
      {
        id: "W1_BASE_5",
        label: "Base Cabinet 5",
        zones: ["W1_BASE_5_Drawer", "W1_BASE_5_Door"],
      },
    ],
  },
  {
    areaId: "WALL-2",
    label: "Sink & Stove Wall",
    units: [
      // Left uppers (inner shelf)
      {
        id: "W2_UPPER_L1",
        label: "Upper Left 1",
        zones: ["W2_UPPER_L1_Top", "W2_UPPER_L1_Bottom"],
      },
      {
        id: "W2_UPPER_L2",
        label: "Upper Left 2",
        zones: ["W2_UPPER_L2_Top", "W2_UPPER_L2_Bottom"],
      },

      // Drawer stack – 3 independent drawers
      {
        id: "W2_DRAWERS",
        label: "Drawer Stack",
        zones: ["W2_DRAWERS_Top", "W2_DRAWERS_Middle", "W2_DRAWERS_Bottom"],
      },

      // Bases left of stove (drawer + door)
      {
        id: "W2_BASE_L1",
        label: "Base Left 1",
        zones: ["W2_BASE_L1_Drawer", "W2_BASE_L1_Door"],
      },
      {
        id: "W2_BASE_L2",
        label: "Base Left 2",
        zones: ["W2_BASE_L2_Drawer", "W2_BASE_L2_Door"],
      },
      {
        id: "W2_BASE_L3",
        label: "Base Left 3",
        zones: ["W2_BASE_L3_Drawer", "W2_BASE_L3_Door"],
      },

      // Stove + dishwasher
      { id: "STOVE", label: "Stove", zones: [] },
      { id: "DISHWASHER", label: "Dishwasher", zones: ["DISHWASHER_Main"] },

      // New uppers above dishwasher (inner shelf)
      {
        id: "W2_DW_UPPER_1",
        label: "Above Dishwasher 1",
        zones: ["W2_DW_UPPER_1_Top", "W2_DW_UPPER_1_Bottom"],
      },
      {
        id: "W2_DW_UPPER_2",
        label: "Above Dishwasher 2",
        zones: ["W2_DW_UPPER_2_Top", "W2_DW_UPPER_2_Bottom"],
      },

      // Sink base – two doors
      {
        id: "SINK",
        label: "Sink Cabinet",
        zones: ["SINK_LeftDoor", "SINK_RightDoor"],
      },

      // Above‑microwave half uppers
      {
        id: "W2_MICRO_UPPER_L",
        label: "Above Microwave Left",
        zones: ["W2_MICRO_UPPER_L_Main"],
      },
      {
        id: "W2_MICRO_UPPER_R",
        label: "Above Microwave Right",
        zones: ["W2_MICRO_UPPER_R_Main"],
      },

      // Right uppers (inner shelf)
      {
        id: "W2_UPPER_R1",
        label: "Upper Right 1",
        zones: ["W2_UPPER_R1_Top", "W2_UPPER_R1_Bottom"],
      },
      {
        id: "W2_UPPER_R2",
        label: "Upper Right 2",
        zones: ["W2_UPPER_R2_Top", "W2_UPPER_R2_Bottom"],
      },

      // Base to right of sink (drawer + door)
      {
        id: "W2_BASE_R1",
        label: "Base Right 1",
        zones: ["W2_BASE_R1_Drawer", "W2_BASE_R1_Door"],
      },
    ],
  },
  {
    areaId: "PEN-1",
    label: "Peninsula 1 – Bar Wall",
    units: [
      {
        id: "PEN1_BASE_1",
        label: "Peninsula 1 Cabinet 1",
        zones: ["PEN1_BASE_1_Drawer", "PEN1_BASE_1_Door"],
      },
      {
        id: "PEN1_BASE_2",
        label: "Peninsula 1 Cabinet 2",
        zones: ["PEN1_BASE_2_Drawer", "PEN1_BASE_2_Door"],
      },
      {
        id: "PEN1_BASE_3",
        label: "Peninsula 1 Cabinet 3",
        zones: ["PEN1_BASE_3_Drawer", "PEN1_BASE_3_Door"],
      },
      {
        id: "PEN1_UPPER_1",
        label: "PEN1 Upper 1",
        zones: ["PEN1_UPPER_1_Top", "PEN1_UPPER_1_Bottom"],
      },
      {
        id: "PEN1_UPPER_2",
        label: "PEN1 Upper 2",
        zones: ["PEN1_UPPER_2_Top", "PEN1_UPPER_2_Bottom"],
      },
      {
        id: "PEN1_UPPER_3",
        label: "PEN1 Upper 3",
        zones: ["PEN1_UPPER_3_Top", "PEN1_UPPER_3_Bottom"],
      },
      {
        id: "PEN1_UPPER_4",
        label: "PEN1 Upper 4",
        zones: ["PEN1_UPPER_4_Top", "PEN1_UPPER_4_Bottom"],
      },
    ],
  },
  {
    areaId: "PEN-2",
    label: "Peninsula 2 – Display Peninsula",
    units: [
      {
        id: "PEN2_BASE_1",
        label: "Peninsula 2 Cabinet 1",
        zones: ["PEN2_BASE_1_Drawer", "PEN2_BASE_1_Door"],
      },
      {
        id: "PEN2_BASE_2",
        label: "Peninsula 2 Cabinet 2",
        zones: ["PEN2_BASE_2_Drawer", "PEN2_BASE_2_Door"],
      },
      {
        id: "PEN2_BASE_3",
        label: "Peninsula 2 Cabinet 3",
        zones: ["PEN2_BASE_3_Drawer", "PEN2_BASE_3_Door"],
      },
      {
        id: "PEN2_UPPER_1",
        label: "Display Cabinet 1",
        zones: ["PEN2_UPPER_1_Top", "PEN2_UPPER_1_Bottom"],
      },
      {
        id: "PEN2_UPPER_2",
        label: "Display Cabinet 2",
        zones: ["PEN2_UPPER_2_Top", "PEN2_UPPER_2_Bottom"],
      },
      {
        id: "PEN2_UPPER_3",
        label: "Display Cabinet 3",
        zones: ["PEN2_UPPER_3_Top", "PEN2_UPPER_3_Bottom"],
      },
      {
        id: "PEN2_UPPER_4",
        label: "Display Cabinet 4",
        zones: ["PEN2_UPPER_4_Top", "PEN2_UPPER_4_Bottom"],
      },
    ],
  },
  {
    areaId: "ISLAND",
    label: "Island",
    units: [
      { id: "ISL_1", label: "Island Cabinet 1", zones: ["ISL_1_Door"] },
      { id: "ISL_2", label: "Island Cabinet 2", zones: ["ISL_2_Door"] },
    ],
  },
];

// Geometry for 3D rendering (scene units ~ 12 in)
export const GEOMETRY: Record<
  string,
  { width: number; depth: number; height: number; x?: number; y?: number; z?: number }
> = {
  // Wall 1
  FREEZER: { width: 2.58, depth: 2.5, height: 5.5, x: -7, z: -5 },
  PANTRY: { width: 2.5, depth: 2.67, height: 6, x: -4.2, z: -5 },
  FRIDGE: { width: 3, depth: 2.67, height: 5.5, x: -1, z: -5 },
  FRIDGE_UPPER_L: { width: 1.25, depth: 1, height: 1.25, x: -1.75, y: 5.8, z: -5 },
  FRIDGE_UPPER_R: { width: 1.25, depth: 1, height: 1.25, x: -0.25, y: 5.8, z: -5 },
  W1_UPPER_1: { width: 1.25, depth: 1, height: 2.5 },
  W1_UPPER_2: { width: 1.25, depth: 1, height: 2.5 },
  W1_UPPER_3: { width: 1.25, depth: 1, height: 2.5 },
  W1_UPPER_4: { width: 1.25, depth: 1, height: 2.5 },
  W1_UPPER_5: { width: 1.25, depth: 1, height: 2.5 },
  W1_BASE_1: { width: 1.25, depth: 2.58, height: 2.5 },
  W1_BASE_2: { width: 1.25, depth: 2.58, height: 2.5 },
  W1_BASE_3: { width: 1.25, depth: 2.58, height: 2.5 },
  W1_BASE_4: { width: 1.25, depth: 2.58, height: 2.5 },
  W1_BASE_5: { width: 1.25, depth: 2.58, height: 2.5 },

  // Wall 2
  W2_UPPER_L1: { width: 1, depth: 1, height: 2.5 },
  W2_UPPER_L2: { width: 1, depth: 1, height: 2.5 },
  W2_DRAWERS: { width: 1.25, depth: 1.5, height: 2.5 },
  W2_BASE_L1: { width: 1.25, depth: 2.58, height: 2.5 },
  W2_BASE_L2: { width: 1.25, depth: 2.58, height: 2.5 },
  W2_BASE_L3: { width: 1.25, depth: 2.58, height: 2.5 },
  STOVE: { width: 2.5, depth: 2, height: 0.2 },
  DISHWASHER: { width: 2, depth: 2, height: 2.5 },
  W2_DW_UPPER_1: { width: 1, depth: 1, height: 2.5 },
  W2_DW_UPPER_2: { width: 1, depth: 1, height: 2.5 },
  SINK: { width: 3, depth: 2, height: 2.5 },
  W2_MICRO_UPPER_L: { width: 1.25, depth: 1, height: 2 },
  W2_MICRO_UPPER_R: { width: 1.25, depth: 1, height: 2 },
  W2_UPPER_R1: { width: 1.25, depth: 1, height: 2.5 },
  W2_UPPER_R2: { width: 1.25, depth: 1, height: 2.5 },
  W2_BASE_R1: { width: 1.5, depth: 2.58, height: 2.5 },

  // Peninsulas
  PEN1_BASE_1: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN1_BASE_2: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN1_BASE_3: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN1_UPPER_1: { width: 1.25, depth: 1, height: 2 },
  PEN1_UPPER_2: { width: 1.25, depth: 1, height: 2 },
  PEN1_UPPER_3: { width: 1.25, depth: 1, height: 2 },
  PEN1_UPPER_4: { width: 1.25, depth: 1, height: 2 },

  PEN2_BASE_1: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN2_BASE_2: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN2_BASE_3: { width: 1.5, depth: 2.58, height: 2.5 },
  PEN2_UPPER_1: { width: 1.25, depth: 1, height: 2 },
  PEN2_UPPER_2: { width: 1.25, depth: 1, height: 2 },
  PEN2_UPPER_3: { width: 1.25, depth: 1, height: 2 },
  PEN2_UPPER_4: { width: 1.25, depth: 1, height: 2 },

  // Island
  ISL_1: { width: 1.25, depth: 2.58, height: 2.5 },
  ISL_2: { width: 1.25, depth: 2.58, height: 2.5 },
};
