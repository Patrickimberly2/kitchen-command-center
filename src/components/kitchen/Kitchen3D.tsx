import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Html } from "@react-three/drei";
import { kitchenLayout } from "@/data/kitchenLayout";

// Unit position mapping - authoritative positions for each unit ID
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
  // WALL-1: Fridge & Pantry Wall - Shifted W1 cabinets to not be behind fridge
  FREEZER: { pos: [-10, 2.75, -5.5], size: [2.6, 5.5, 2.5], type: "freezer" },
  PANTRY: { pos: [-7, 3, -5.5], size: [2.5, 6, 2.7], type: "pantry" },
  FRIDGE: { pos: [-4, 2.75, -5.5], size: [3, 5.5, 2.7], type: "fridge" },
  "FRIDGE-UPPER-L": { pos: [-4.75, 6, -5.5], size: [1.25, 1.25, 1], type: "cabinet" },
  "FRIDGE-UPPER-R": { pos: [-3.25, 6, -5.5], size: [1.25, 1.25, 1], type: "cabinet" },

  // Wall 1 base cabinets - shifted right, starting after fridge, continuous run
  "W1-BASE-1": { pos: [-1.5, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-2": { pos: [-0.15, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-3": { pos: [1.2, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-4": { pos: [2.55, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },
  "W1-BASE-5": { pos: [3.9, 1.25, -5.5], size: [1.35, 2.5, 2.6], type: "base-drawer" },

  // Wall 1 upper cabinets - aligned with bases, connected run
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

  // PENINSULA 1 - bases stay in a line; uppers now side‑by‑side like fridge wall
  "PEN1-BASE-1": { pos: [3.2, 1.25, 3.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "left" },
  "PEN1-BASE-2": { pos: [3.2, 1.25, 1.95], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "left" },
  "PEN1-BASE-3": { pos: [3.2, 1.25, 0.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "left" },

  // All uppers share same y & z; x increments by cabinet width so they touch
  "PEN1-UPPER-1": { pos: [1.9, 4.5, 3.45], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "front" },
  "PEN1-UPPER-2": { pos: [3.15, 4.5, 3.45], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "front" },
  "PEN1-UPPER-3": { pos: [4.4, 4.5, 3.45], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "front" },
  "PEN1-UPPER-4": { pos: [5.65, 4.5, 3.45], size: [1.25, 2.5, 1], type: "upper-split", handleDir: "front" },

  // PENINSULA 2 - same idea, mirrored
  "PEN2-BASE-1": { pos: [-10.8, 1.25, 3.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "right" },
  "PEN2-BASE-2": { pos: [-10.8, 1.25, 1.95], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "right" },
  "PEN2-BASE-3": { pos: [-10.8, 1.25, 0.45], size: [1.25, 2.5, 1.5], type: "base-drawer", handleDir: "right" },

  "PEN2-UPPER-1": { pos: [-12.1, 4.5, 3.45], size: [1.25, 2.5, 1], type: "glass", handleDir: "front" },
  "PEN2-UPPER-2": { pos: [-10.85, 4.5, 3.45], size: [1.25, 2.5, 1], type: "glass", handleDir: "front" },
  "PEN2-UPPER-3": { pos: [-9.6, 4.5, 3.45], size: [1.25, 2.5, 1], type: "glass", handleDir: "front" },
  "PEN2-UPPER-4": { pos: [-8.35, 4.5, 3.45], size: [1.25, 2.5, 1], type: "glass", handleDir: "front" },

  // ISLAND - connected block
  "ISL-1": { pos: [-2.625, 1.25, 0], size: [1.25, 2.5, 2.6], type: "cabinet" },
  "ISL-2": { pos: [-1.375, 1.25, 0], size: [1.25, 2.5, 2.6], type: "cabinet" },
};

// Color palette
const COLORS = {
  woodDark: "#8b4513",
  woodMedium: "#a0522d",
  woodLight: "#c9a66b",
  applianceBlack: "#1a1a1a",
  applianceWhite: "#f5f5f5",
  countertop: "#c9a882",
  stainless: "#a0a0a0",
};

// Get color based on unit type and ID
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
          <div
            className={`rounded px-1 py-0.5 text-[8px] font-medium whitespace-nowrap ${
              isSelected ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            }`}
          >
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

  // Freezer: 5 zones
  if (type === "freezer") {
    const zoneHeight = size[1] / 5;
    return (
      <group position={pos}>
        <RoundedBox args={[size[0], size[1], size[2]]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color={COLORS.applianceWhite}
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
        {zones.map((zone, i) => (
          <ZoneMesh
            key={zone}
            zoneId={zone}
            position={[0, size[1] / 2 - zoneHeight * (i + 0.5), 0]}
            size={[size[0] - 0.1, zoneHeight - 0.05, size[2] - 0.1]}
            color={i === 4 ? "#e0d4c8" : "#f0ece8"}
            isSelected={selectedZoneId === zone}
            onClick={onClick}
            label={zone}
          />
        ))}
        <Html position={[0, size[1] / 2 + 0.3, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Pantry: 8 zones
  if (type === "pantry") {
    const zoneHeight = size[1] / 8;
    return (
      <group position={pos}>
        <RoundedBox args={[size[0], size[1], size[2]]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color={COLORS.applianceWhite}
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
        {zones.map((zone, i) => (
          <ZoneMesh
            key={zone}
            zoneId={zone}
            position={[0, size[1] / 2 - zoneHeight * (i + 0.5), 0]}
            size={[size[0] - 0.1, zoneHeight - 0.03, size[2] - 0.1]}
            color="#f5f0eb"
            isSelected={selectedZoneId === zone}
            onClick={onClick}
            label={zone}
          />
        ))}
        <Html position={[0, size[1] / 2 + 0.3, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Fridge
  if (type === "fridge") {
    return (
      <group position={pos}>
        <RoundedBox args={[size[0], size[1], size[2]]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color={COLORS.applianceBlack}
            roughness={0.2}
            metalness={0.5}
            transparent
            opacity={0.4}
          />
        </RoundedBox>
        {/* Interior zones */}
        <ZoneMesh
          zoneId="FridgeTopShelfLeft"
          position={[-size[0] / 4, size[1] / 2 - 0.6, 0]}
          size={[size[0] / 2 - 0.1, 0.8, size[2] - 0.3]}
          color="#e8e4e0"
          isSelected={selectedZoneId === "FridgeTopShelfLeft"}
          onClick={onClick}
          label="Top Left"
        />
        <ZoneMesh
          zoneId="FridgeTopShelfRight"
          position={[size[0] / 4, size[1] / 2 - 0.6, 0]}
          size={[size[0] / 2 - 0.1, 0.8, size[2] - 0.3]}
          color="#e8e4e0"
          isSelected={selectedZoneId === "FridgeTopShelfRight"}
          onClick={onClick}
          label="Top Right"
        />
        <ZoneMesh
          zoneId="FridgeMiddleShelf"
          position={[0, size[1] / 2 - 1.8, 0]}
          size={[size[0] - 0.2, 1, size[2] - 0.3]}
          color="#e8e4e0"
          isSelected={selectedZoneId === "FridgeMiddleShelf"}
          onClick={onClick}
          label="Middle"
        />
        <ZoneMesh
          zoneId="FridgeBottomShelf"
          position={[0, size[1] / 2 - 3, 0]}
          size={[size[0] - 0.2, 1, size[2] - 0.3]}
          color="#e8e4e0"
          isSelected={selectedZoneId === "FridgeBottomShelf"}
          onClick={onClick}
          label="Bottom"
        />
        <ZoneMesh
          zoneId="CrisperLeft"
          position={[-size[0] / 4, size[1] / 2 - 4.2, 0]}
          size={[size[0] / 2 - 0.1, 0.9, size[2] - 0.3]}
          color="#d4e8d4"
          isSelected={selectedZoneId === "CrisperLeft"}
          onClick={onClick}
          label="Crisper L"
        />
        <ZoneMesh
          zoneId="CrisperRight"
          position={[size[0] / 4, size[1] / 2 - 4.2, 0]}
          size={[size[0] / 2 - 0.1, 0.9, size[2] - 0.3]}
          color="#d4e8d4"
          isSelected={selectedZoneId === "CrisperRight"}
          onClick={onClick}
          label="Crisper R"
        />
        {/* Door bins */}
        <ZoneMesh
          zoneId="FridgeLeftDoorTop"
          position={[-size[0] / 2 + 0.2, size[1] / 2 - 0.8, size[2] / 2 + 0.1]}
          size={[0.3, 0.8, 0.2]}
          color="#f0f0f0"
          isSelected={selectedZoneId === "FridgeLeftDoorTop"}
          onClick={onClick}
          label="L Door Top"
        />
        <ZoneMesh
          zoneId="FridgeLeftDoorMiddle"
          position={[-size[0] / 2 + 0.2, size[1] / 2 - 2, size[2] / 2 + 0.1]}
          size={[0.3, 0.8, 0.2]}
          color="#f0f0f0"
          isSelected={selectedZoneId === "FridgeLeftDoorMiddle"}
          onClick={onClick}
          label="L Door Mid"
        />
        <ZoneMesh
          zoneId="FridgeLeftDoorBottom"
          position={[-size[0] / 2 + 0.2, size[1] / 2 - 3.2, size[2] / 2 + 0.1]}
          size={[0.3, 0.8, 0.2]}
          color="#f0f0f0"
          isSelected={selectedZoneId === "FridgeLeftDoorBottom"}
          onClick={onClick}
          label="L Door Bot"
        />
        <ZoneMesh
          zoneId="FridgeRightDoorTop"
          position={[size[0] / 2 - 0.2, size[1] / 2 - 0.8, size[2] / 2 + 0.1]}
          size={[0.3, 0.8, 0.2]}
          color="#f0f0f0"
          isSelected={selectedZoneId === "FridgeRightDoorTop"}
          onClick={onClick}
          label="R Door Top"
        />
        <ZoneMesh
          zoneId="FridgeRightDoorMiddle"
          position={[size[0] / 2 - 0.2, size[1] / 2 - 2, size[2] / 2 + 0.1]}
          size={[0.3, 0.8, 0.2]}
          color="#f0f0f0"
          isSelected={selectedZoneId === "FridgeRightDoorMiddle"}
          onClick={onClick}
          label="R Door Mid"
        />
        <ZoneMesh
          zoneId="FridgeRightDoorBottom"
          position={[size[0] / 2 - 0.2, size[1] / 2 - 3.2, size[2] / 2 + 0.1]}
          size={[0.3, 0.8, 0.2]}
          color="#f0f0f0"
          isSelected={selectedZoneId === "FridgeRightDoorBottom"}
          onClick={onClick}
          label="R Door Bot"
        />
        <Html position={[0, size[1] / 2 + 0.3, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Drawer stack
  if (type === "drawer") {
    const drawerHeight = size[1] / 3;
    return (
      <group position={pos}>
        {zones.map((zone, i) => (
          <ZoneMesh
            key={zone}
            zoneId={zone}
            position={[0, size[1] / 2 - drawerHeight * (i + 0.5), 0]}
            size={[size[0], drawerHeight - 0.05, size[2]]}
            color={COLORS.applianceWhite}
            isSelected={selectedZoneId === zone}
            onClick={onClick}
            label={zone.replace("W2-DRAWERS-", "")}
          />
        ))}
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Base cabinet with drawer + door
  if (type === "base-drawer") {
    const drawerZone = zones.find((z) => z.includes("Drawer"));
    const doorZone = zones.find((z) => z.includes("Door"));
    const drawerHeight = size[1] * 0.3;
    const doorHeight = size[1] * 0.7;

    return (
      <group position={pos}>
        {drawerZone && (
          <ZoneMesh
            zoneId={drawerZone}
            position={[0, size[1] / 2 - drawerHeight / 2, 0]}
            size={[size[0], drawerHeight - 0.03, size[2]]}
            color={COLORS.woodLight}
            isSelected={selectedZoneId === drawerZone}
            onClick={onClick}
            label="Drawer"
          />
        )}
        {doorZone && (
          <ZoneMesh
            zoneId={doorZone}
            position={[0, -size[1] / 2 + doorHeight / 2, 0]}
            size={[size[0], doorHeight - 0.03, size[2]]}
            color={COLORS.woodLight}
            isSelected={selectedZoneId === doorZone}
            onClick={onClick}
            label="Door"
          />
        )}
        {/* Handles */}
        <mesh
          position={
            [...getHandleOffset().map((v, i) => (i === 1 ? size[1] / 2 - drawerHeight / 2 : v))] as [
              number,
              number,
              number,
            ]
          }
          rotation={handleRotation}
        >
          <boxGeometry args={[size[0] * 0.3, 0.04, 0.02]} />
          <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh
          position={[...getHandleOffset().map((v, i) => (i === 1 ? 0 : v))] as [number, number, number]}
          rotation={handleRotation}
        >
          <boxGeometry args={[size[0] * 0.15, 0.04, 0.02]} />
          <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
        </mesh>
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Upper cabinet split into top/bottom
  if (type === "upper-split") {
    const topZone = zones.find((z) => z.includes("Top"));
    const bottomZone = zones.find((z) => z.includes("Bottom"));
    const halfHeight = size[1] / 2;

    return (
      <group position={pos}>
        {topZone && (
          <ZoneMesh
            zoneId={topZone}
            position={[0, halfHeight / 2, 0]}
            size={[size[0], halfHeight - 0.02, size[2]]}
            color={COLORS.woodDark}
            isSelected={selectedZoneId === topZone}
            onClick={onClick}
            label="Top"
          />
        )}
        {bottomZone && (
          <ZoneMesh
            zoneId={bottomZone}
            position={[0, -halfHeight / 2, 0]}
            size={[size[0], halfHeight - 0.02, size[2]]}
            color={COLORS.woodDark}
            isSelected={selectedZoneId === bottomZone}
            onClick={onClick}
            label="Bottom"
          />
        )}
        <mesh position={getHandleOffset()} rotation={handleRotation}>
          <boxGeometry args={[size[0] * 0.2, 0.04, 0.02]} />
          <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
        </mesh>
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Sink cabinet with 2 doors
  if (type === "sink-cabinet") {
    const leftDoor = zones.find((z) => z.includes("Left"));
    const rightDoor = zones.find((z) => z.includes("Right"));
    const halfWidth = size[0] / 2;

    return (
      <group position={pos}>
        {leftDoor && (
          <ZoneMesh
            zoneId={leftDoor}
            position={[-halfWidth / 2, 0, 0]}
            size={[halfWidth - 0.02, size[1], size[2]]}
            color={COLORS.woodLight}
            isSelected={selectedZoneId === leftDoor}
            onClick={onClick}
            label="Left Door"
          />
        )}
        {rightDoor && (
          <ZoneMesh
            zoneId={rightDoor}
            position={[halfWidth / 2, 0, 0]}
            size={[halfWidth - 0.02, size[1], size[2]]}
            color={COLORS.woodLight}
            isSelected={selectedZoneId === rightDoor}
            onClick={onClick}
            label="Right Door"
          />
        )}
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Stove
  if (unitId === "STOVE") {
    return (
      <group position={pos}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={size} />
          <meshStandardMaterial color={hovered ? "#ea580c" : color} roughness={0.3} metalness={0.5} />
        </mesh>
        {[-0.5, 0.5].map((z, i) =>
          [-0.5, 0.5].map((x, j) => (
            <mesh key={`burner-${i}-${j}`} position={[0.1, 0.1, z + x * 0.7]}>
              <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
          )),
        )}
        <Html position={[0, 0.5, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Glass cabinets (PEN2 uppers)
  if (type === "glass") {
    const topZone = zones.find((z) => z.includes("Top"));
    const bottomZone = zones.find((z) => z.includes("Bottom"));
    const halfHeight = size[1] / 2;

    return (
      <group position={pos}>
        <RoundedBox args={size} radius={0.02} smoothness={4}>
          <meshStandardMaterial color="#d4b896" roughness={0.5} metalness={0.05} transparent opacity={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, size[2] * 0.35]}>
          <boxGeometry args={[size[0] * 0.8, size[1] * 0.85, 0.02]} />
          <meshStandardMaterial color="#b8d4e8" transparent opacity={0.25} roughness={0.05} />
        </mesh>
        {topZone && (
          <ZoneMesh
            zoneId={topZone}
            position={[0, halfHeight / 2, 0]}
            size={[size[0] - 0.1, halfHeight - 0.05, size[2] - 0.1]}
            color="#e8e4dc"
            isSelected={selectedZoneId === topZone}
            onClick={onClick}
            label="Top"
          />
        )}
        {bottomZone && (
          <ZoneMesh
            zoneId={bottomZone}
            position={[0, -halfHeight / 2, 0]}
            size={[size[0] - 0.1, halfHeight - 0.05, size[2] - 0.1]}
            color="#e8e4dc"
            isSelected={selectedZoneId === bottomZone}
            onClick={onClick}
            label="Bottom"
          />
        )}
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap bg-card/80 text-foreground border border-border">
            {label}
          </div>
        </Html>
      </group>
    );
  }

  // Simple cabinet/appliance with a single Main zone
  const isAppliance = type === "appliance";
  const isSelected = zones.some((z) => selectedZoneId === z) || selectedZoneId === zones[0];

  return (
    <group position={pos}>
      <RoundedBox
        args={size}
        radius={0.03}
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          if (zones[0]) onClick(zones[0]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isSelected ? "#c2410c" : hovered ? "#ea580c" : color}
          roughness={isAppliance ? 0.2 : 0.6}
          metalness={isAppliance ? 0.6 : 0.05}
        />
      </RoundedBox>
      {!isAppliance && (
        <mesh position={getHandleOffset()} rotation={handleRotation}>
          <boxGeometry args={[size[0] * 0.2, 0.04, 0.02]} />
          <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : hovered
                ? "bg-accent text-accent-foreground"
                : "bg-card/80 text-foreground border border-border"
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
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
      {/* Wall 1 - Back */}
      <mesh position={[-2, 4, -6.5]}>
        <boxGeometry args={[18, 8, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-2, 7.85, -6.5]}>
        <boxGeometry args={[18, 0.3, 0.25]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      {/* Wall 2 - Front */}
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
      {/* Wall 1 */}
      <mesh position={[1.2, 2.55, -5.5]}>
        <boxGeometry args={[7, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Wall 2 */}
      <mesh position={[-3.8, 2.55, 5.5]}>
        <boxGeometry args={[12.75, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Peninsula 1 */}
      <mesh position={[3.2, 2.55, 1.95]}>
        <boxGeometry args={[1.45, 0.08, 4.5]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Peninsula 2 */}
      <mesh position={[-10.8, 2.55, 1.95]}>
        <boxGeometry args={[1.45, 0.08, 4.5]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Island */}
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
