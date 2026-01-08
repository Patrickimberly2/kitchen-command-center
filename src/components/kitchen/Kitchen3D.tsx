import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Html } from "@react-three/drei";
import { kitchenLayout } from "@/data/kitchenLayout";

const UNIT_POSITIONS: Record<
  string,
  {
    pos: [number, number, number];
    size: [number, number, number];
    type:
      | "cabinet"
      | "appliance"
      | "glass"
      | "drawer"
      | "freezer"
      | "pantry"
      | "fridge"
      | "base-drawer"
      | "upper-split"
      | "sink-cabinet";
    handleDir?: "front" | "back" | "left" | "right";
  }
> = {
  // WALL-1: Fridge & Pantry Wall
  FREEZER: { pos: [-10, 2.75, -5.5], size: [2.6, 5.5, 2.5], type: "freezer" },
  PANTRY: { pos: [-7, 3, -5.5], size: [2.5, 6, 2.7], type: "pantry" },
  FRIDGE: { pos: [-4, 2.75, -5.5], size: [3, 5.5, 2.7], type: "fridge" },
  "FRIDGE-UPPER-L": { pos: [-4.75, 6, -5.5], size: [1.25, 1.25, 1], type: "cabinet" },
  "FRIDGE-UPPER-R": { pos: [-3.25, 6, -5.5], size: [1.25, 1.25, 1], type: "cabinet" },

  "W1-BASE-1": { pos: [-1.5, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-2": { pos: [-0.15, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-3": { pos: [1.2, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-4": { pos: [2.55, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-5": { pos: [3.9, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },

  "W1-UPPER-1": { pos: [-1.5, 4.5, -5.5], size: [1.35, 2.5, 1], type: "upper-split" },
  "W1-UPPER-2": { pos: [-0.15, 4.5, -5.5], size: [1.35, 2.5, 1], type: "upper-split" },
  "W1-UPPER-3": { pos: [1.2, 4.5, -5.5], size: [1.35, 2.5, 1], type: "upper-split" },
  "W1-UPPER-4": { pos: [2.55, 4.5, -5.5], size: [1.35, 2.5, 1], type: "upper-split" },
  "W1-UPPER-5": { pos: [3.9, 4.5, -5.5], size: [1.35, 2.5, 1], type: "upper-split" },

  // WALL-2: Sink & Stove Wall
  "W2-UPPER-L1": { pos: [-10, 4.5, 5.5], size: [1, 2.5, 1], type: "upper-split", handleDir: "back" },
  "W2-UPPER-L2": { pos: [-8.65, 4.5, 5.5], size: [1, 2.5, 1], type: "upper-split", handleDir: "back" },
  "W2-DRAWERS": { pos: [1.95, 1.25, 5.5], size: [1.25, 2.5, 2.6], type: "drawer", handleDir: "back" },
  "W2-BASE-L1": { pos: [-6.425, 1.25, 5.5], size: [1.5, 2.5, 2.6], type: "base-drawer", handleDir: "back" },
  "W2-BASE-L2": { pos: [-7.925, 1.25, 5.5], size: [1.5, 2.5, 2.6], type: "base-drawer", handleDir: "back" },
  "W2-BASE-L3": { pos: [-9.425, 1.25, 5.5], size: [1.5, 2.5, 2.6], type: "base-drawer", handleDir: "back" },
  DISHWASHER: { pos: [-2.175, 1.25, 5.5], size: [2, 2.5, 2.6], type: "appliance", handleDir: "back" },
  "W2-DW-UPPER-1": { pos: [-2.675, 4.5, 5.5], size: [1, 2.5, 1], type: "upper-split", handleDir: "back" },
  "W2-DW-UPPER-2": { pos: [-1.675, 4.5, 5.5], size: [1, 2.5, 1], type: "upper-split", handleDir: "back" },
  STOVE: { pos: [-4.425, 2.6, 5.5], size: [2.5, 0.15, 2.6], type: "appliance" },
  "W2-MICRO-UPPER-L": { pos: [-5.1, 5.5, 5.5], size: [1.2, 1.5, 1], type: "cabinet", handleDir: "back" },
  "W2-MICRO-UPPER-R": { pos: [-3.9, 5.5, 5.5], size: [1.2, 1.5, 1], type: "cabinet", handleDir: "back" },
  SINK: { pos: [0.075, 1.25, 5.5], size: [2.5, 2.5, 2.6], type: "sink-cabinet", handleDir: "back" },
  "W2-BASE-R1": { pos: [1.45, 1.25, 5.5], size: [1.25, 2.5, 2.6], type: "base-drawer", handleDir: "back" },
  "W2-UPPER-R1": { pos: [-0.5, 4.5, 5.5], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "back" },
  "W2-UPPER-R2": { pos: [0.75, 4.5, 5.5], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "back" },

  // PENINSULA 1 – bases face left toward sink wall; uppers now match
  "PEN1-BASE-1": { pos: [3.2, 1.25, 3.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "left" },
  "PEN1-BASE-2": { pos: [3.2, 1.25, 1.95], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "left" },
  "PEN1-BASE-3": { pos: [3.2, 1.25, 0.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "left" },

  "PEN1-UPPER-1": { pos: [1.7, 4.5, 1.95], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "left" },
  "PEN1-UPPER-2": { pos: [2.95, 4.5, 1.95], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "left" },
  "PEN1-UPPER-3": { pos: [4.2, 4.5, 1.95], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "left" },
  "PEN1-UPPER-4": { pos: [5.45, 4.5, 1.95], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "left" },

  // PENINSULA 2 – bases face right toward pantry; uppers now match
  "PEN2-BASE-1": { pos: [-10.8, 1.25, 3.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "right" },
  "PEN2-BASE-2": { pos: [-10.8, 1.25, 1.95], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "right" },
  "PEN2-BASE-3": { pos: [-10.8, 1.25, 0.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "right" },

  "PEN2-UPPER-1": { pos: [-12.3, 4.5, 1.95], size: [1.25, 2.5, 1], type: "glass", handleDir: "right" },
  "PEN2-UPPER-2": { pos: [-11.05, 4.5, 1.95], size: [1.25, 2.5, 1], type: "glass", handleDir: "right" },
  "PEN2-UPPER-3": { pos: [-9.8, 4.5, 1.95], size: [1.25, 2.5, 1], type: "glass", handleDir: "right" },
  "PEN2-UPPER-4": { pos: [-8.55, 4.5, 1.95], size: [1.25, 2.5, 1], type: "glass", handleDir: "right" },

  // ISLAND
  "ISL-1": { pos: [-2.625, 1.25, 0], size: [1.25, 2.5, 2.6], type: "cabinet" },
  "ISL-2": { pos: [-1.375, 1.25, 0], size: [1.25, 2.5, 2.6], type: "cabinet" },
};

const COLORS = {
  woodDark: "#8b4513",
  woodMedium: "#a0522d",
  woodLight: "#c9a66b",
  applianceBlack: "#1a1a1a",
  applianceWhite: "#f5f5f5",
  countertop: "#c9a882",
  stainless: "#a0a0a0",
};

function getUnitColor(unitId: string, type: string): string {
  if (type === "appliance") {
    if (unitId === "FREEZER" || unitId === "FRIDGE") return COLORS.applianceBlack;
    if (unitId === "DISHWASHER") return COLORS.applianceWhite;
    if (unitId === "STOVE") return COLORS.applianceBlack;
    return COLORS.stainless;
  }
  if (type === "freezer" || type === "pantry" || type === "fridge") return COLORS.applianceWhite;
  if (unitId.includes("UPPER") || unitId.includes("MICRO")) return COLORS.woodDark;
  if (unitId === "PANTRY") return COLORS.applianceWhite;
  return COLORS.woodLight;
}

interface ZoneMeshProps {
  zoneId: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  isSelected: boolean;
  onClick: (zoneId: string) => void;
  label: string;
}

function ZoneMesh({ zoneId, position, size, color, isSelected, onClick, label }: ZoneMeshProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <RoundedBox
        args={size}
        radius={0.02}
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          onClick(zoneId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isSelected ? "#c2410c" : hovered ? "#ea580c" : color}
          roughness={0.5}
          metalness={0.05}
        />
      </RoundedBox>
      {(isSelected || hovered) && (
        <Html position={[0, size[1] / 2 + 0.15, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1 py-0.5 text-[8px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

interface UnitMeshProps {
  unitId: string;
  label: string;
  zones: string[];
  selectedZoneId: string | null;
  onClick: (zoneId: string) => void;
}

function UnitMesh({ unitId, label, zones, selectedZoneId, onClick }: UnitMeshProps) {
  const [hovered, setHovered] = useState(false);
  const config = UNIT_POSITIONS[unitId];
  if (!config) return null;

  const { pos, size, type, handleDir = "front" } = config;
  const color = getUnitColor(unitId, type);

  const handleRotation =
    handleDir === "left" || handleDir === "right"
      ? ([0, Math.PI / 2, 0] as [number, number, number])
      : ([0, 0, 0] as [number, number, number]);

  const getHandleOffset = (): [number, number, number] => {
    switch (handleDir) {
      case "front":
        return [0, 0, size[2] / 2 + 0.02];
      case "back":
        return [0, 0, -size[2] / 2 - 0.02];
      case "left":
        return [-size[0] / 2 - 0.02, 0, 0];
      case "right":
        return [size[0] / 2 + 0.02, 0, 0];
    }
  };

  /* All the specialized renderers (freezer, pantry, fridge, drawers, base-drawer,
     upper-split, sink-cabinet, stove, glass) stay the same as in the previous
     full file you pasted. For brevity, only UNIT_POSITIONS and handleDir changes
     were needed to fix the direction of the peninsula uppers. */
  // -------------------------------------------------------------------------
  // Paste here the same UnitMesh implementation and helpers from the last
  // full file I sent you; no other logic needs to change, only UNIT_POSITIONS.
  // -------------------------------------------------------------------------
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial color="#5d4e3c" roughness={0.7} />
    </mesh>
  );
}

function Walls() {
  return (
    <>
      <mesh position={[-2, 4, -6.5]}>
        <boxGeometry args={[18, 8, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-2, 7.85, -6.5]}>
        <boxGeometry args={[18, 0.3, 0.25]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      <mesh position={[-2, 4, 6.5]}>
        <boxGeometry args={[18, 8, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-2, 7.85, 6.5]}>
        <boxGeometry args={[18, 0.3, 0.25]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
    </>
  );
}

function Countertops() {
  return (
    <>
      <mesh position={[1.2, 2.55, -5.5]}>
        <boxGeometry args={[7, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      <mesh position={[-3.8, 2.55, 5.5]}>
        <boxGeometry args={[12.75, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      <mesh position={[3.2, 2.55, 1.95]}>
        <boxGeometry args={[1.45, 0.08, 4.5]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      <mesh position={[-10.8, 2.55, 1.95]}>
        <boxGeometry args={[1.45, 0.08, 4.5]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      <mesh position={[-2, 2.55, 0]}>
        <boxGeometry args={[2.7, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
    </>
  );
}

function Microwave() {
  return (
    <mesh position={[-4.5, 4, 5.5]}>
      <boxGeometry args={[2.5, 1.2, 1.5]} />
      <meshStandardMaterial color="#4a4063" metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

function SinkBasin() {
  return (
    <mesh position={[0.075, 2.6, 5.35]}>
      <boxGeometry args={[1.8, 0.5, 0.15]} />
      <meshStandardMaterial color={COLORS.stainless} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

interface Kitchen3DProps {
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
}

export default function Kitchen3D({ selectedUnitId, onSelectUnit }: Kitchen3DProps) {
  const allUnits = kitchenLayout.flatMap((area) =>
    area.units.filter((unit) => unit.zones.length > 0 || unit.id === "STOVE"),
  );

  return (
    <div className="h-[500px] w-full rounded-2xl border border-border bg-gradient-to-b from-muted to-background overflow-hidden shadow-inner">
      <Canvas shadows camera={{ position: [12, 10, 12], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={["#f5f5f5"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 12, 8]} intensity={1.2} castShadow />
        <pointLight position={[-5, 6, -5]} intensity={0.4} />
        <pointLight position={[5, 6, 5]} intensity={0.4} />

        <Floor />
        <Walls />
        <Countertops />
        <Microwave />
        <SinkBasin />

        {allUnits.map((unit) => (
          <UnitMesh
            key={unit.id}
            unitId={unit.id}
            label={unit.label}
            zones={unit.zones}
            selectedZoneId={selectedUnitId}
            onClick={onSelectUnit}
          />
        ))}

        <OrbitControls
          enablePan
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={6}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
}
