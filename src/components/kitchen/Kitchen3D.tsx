import React, { useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Html } from "@react-three/drei";
import { kitchenLayout } from "@/data/kitchenLayout";

// Unit position mapping - authoritative positions for each unit ID
const UNIT_POSITIONS: Record<string, { pos: [number, number, number]; size: [number, number, number]; type: 'cabinet' | 'appliance' | 'glass' | 'drawer'; handleDir?: 'front' | 'back' | 'left' | 'right' }> = {
  // WALL-1: Fridge & Pantry Wall
  "FREEZER": { pos: [-10, 2.75, -5.5], size: [2.6, 5.5, 2.5], type: 'appliance' },
  "PANTRY": { pos: [-7, 3, -5.5], size: [2.5, 6, 2.7], type: 'cabinet' },
  "FRIDGE": { pos: [-4, 2.75, -5.5], size: [3, 5.5, 2.7], type: 'appliance' },
  "FRIDGE-UPPER-L": { pos: [-4.75, 6, -5.5], size: [1.25, 1.25, 1], type: 'cabinet' },
  "FRIDGE-UPPER-R": { pos: [-3.25, 6, -5.5], size: [1.25, 1.25, 1], type: 'cabinet' },
  // Wall 1 base cabinets - all 5 straight across the wall, aligned with fridge
  "W1-BASE-1": { pos: [-2.25, 1.25, -5.5], size: [1.25, 2.5, 2.6], type: 'cabinet' },
  "W1-BASE-2": { pos: [-0.9, 1.25, -5.5], size: [1.25, 2.5, 2.6], type: 'cabinet' },
  "W1-BASE-3": { pos: [0.45, 1.25, -5.5], size: [1.25, 2.5, 2.6], type: 'cabinet' },
  "W1-BASE-4": { pos: [1.8, 1.25, -5.5], size: [1.25, 2.5, 2.6], type: 'cabinet' },
  "W1-BASE-5": { pos: [3.15, 1.25, -5.5], size: [1.25, 2.5, 2.6], type: 'cabinet' },
  // Wall 1 upper cabinets - above base cabinets
  "W1-UPPER-1": { pos: [-2.25, 4.5, -5.5], size: [1.25, 2.5, 1], type: 'cabinet' },
  "W1-UPPER-2": { pos: [-0.9, 4.5, -5.5], size: [1.25, 2.5, 1], type: 'cabinet' },
  "W1-UPPER-3": { pos: [0.45, 4.5, -5.5], size: [1.25, 2.5, 1], type: 'cabinet' },
  "W1-UPPER-4": { pos: [1.8, 4.5, -5.5], size: [1.25, 2.5, 1], type: 'cabinet' },
  "W1-UPPER-5": { pos: [3.15, 4.5, -5.5], size: [1.25, 2.5, 1], type: 'cabinet' },

  // WALL-2: Sink & Stove Wall (parallel to Wall 1, facing it)
  "W2-UPPER-L1": { pos: [-10, 4.5, 5.5], size: [1, 2.5, 1], type: 'cabinet', handleDir: 'back' },
  "W2-UPPER-L2": { pos: [-8.65, 4.5, 5.5], size: [1, 2.5, 1], type: 'cabinet', handleDir: 'back' },
  // W2-DRAWERS: right edge connects to front-left of PEN1-BASE-1
  "W2-DRAWERS": { pos: [1.95, 1.25, 5.5], size: [1.25, 2.5, 2.6], type: 'drawer', handleDir: 'back' },
  // W2-BASE-L1, L2, L3: connected to left edge of STOVE
  "W2-BASE-L1": { pos: [-6.425, 1.25, 5.5], size: [1.5, 2.5, 2.6], type: 'cabinet', handleDir: 'back' },
  "W2-BASE-L2": { pos: [-7.925, 1.25, 5.5], size: [1.5, 2.5, 2.6], type: 'cabinet', handleDir: 'back' },
  "W2-BASE-L3": { pos: [-9.425, 1.25, 5.5], size: [1.5, 2.5, 2.6], type: 'cabinet', handleDir: 'back' },
  // DISHWASHER: right edge connects to left edge of SINK
  "DISHWASHER": { pos: [-2.175, 1.25, 5.5], size: [2, 2.5, 2.6], type: 'appliance', handleDir: 'back' },
  // STOVE: right edge connects to left edge of DISHWASHER, left edge connects to W2-BASE-L1
  "STOVE": { pos: [-4.425, 2.6, 5.5], size: [2.5, 0.15, 2.6], type: 'appliance' },
  "W2-MICRO-UPPER-L": { pos: [-5.1, 5.5, 5.5], size: [1.2, 1.5, 1], type: 'cabinet', handleDir: 'back' },
  "W2-MICRO-UPPER-R": { pos: [-3.9, 5.5, 5.5], size: [1.2, 1.5, 1], type: 'cabinet', handleDir: 'back' },
  // SINK: right edge connects to left edge of drawers
  "SINK": { pos: [0.075, 1.25, 5.5], size: [2.5, 2.5, 2.6], type: 'cabinet', handleDir: 'back' },
  "W2-UPPER-R1": { pos: [1, 4.5, 5.5], size: [1.25, 2.5, 1], type: 'cabinet', handleDir: 'back' },
  "W2-UPPER-R2": { pos: [2.5, 4.5, 5.5], size: [1.25, 2.5, 1], type: 'cabinet', handleDir: 'back' },

  // PENINSULA 1 - perpendicular off right end of Wall 2
  "PEN1-BASE-1": { pos: [3.2, 1.25, 3.4], size: [1.25, 2.5, 2.6], type: 'cabinet', handleDir: 'left' },
  "PEN1-BASE-2": { pos: [3.2, 1.25, 1.6], size: [1.5, 2.5, 2.6], type: 'cabinet', handleDir: 'left' },
  "PEN1-BASE-3": { pos: [3.2, 1.25, -0.2], size: [1.5, 2.5, 2.6], type: 'cabinet', handleDir: 'left' },
  // 3 stacked drawers at left angle from PEN1-BASE-3
  "PEN1-DRAWER-1": { pos: [1.5, 1.25, -0.2], size: [1.25, 2.5, 2.6], type: 'drawer', handleDir: 'front' },
  "PEN1-DRAWER-2": { pos: [0.1, 1.25, -0.2], size: [1.25, 2.5, 2.6], type: 'drawer', handleDir: 'front' },
  "PEN1-DRAWER-3": { pos: [-1.3, 1.25, -0.2], size: [1.25, 2.5, 2.6], type: 'drawer', handleDir: 'front' },
  // Upper cabinets above Peninsula 1 base cabinets (4 cabinets)
  "PEN1-UPPER-1": { pos: [3.2, 4.5, 3.4], size: [1.25, 2.5, 1], type: 'cabinet', handleDir: 'left' },
  "PEN1-UPPER-2": { pos: [3.2, 4.5, 2], size: [1.25, 2.5, 1], type: 'cabinet', handleDir: 'left' },
  "PEN1-UPPER-3": { pos: [3.2, 4.5, 0.6], size: [1.25, 2.5, 1], type: 'cabinet', handleDir: 'left' },
  "PEN1-UPPER-4": { pos: [3.2, 4.5, -0.8], size: [1.25, 2.5, 1], type: 'cabinet', handleDir: 'left' },

  // PENINSULA 2 - Display Peninsula: front-right of PEN2-BASE-1 connects to front-left of W2-BASE-L3
  // W2-BASE-L3 front-left corner: x = -10.175, z = 4.2
  // PEN2 cabinets narrower (1.25 wide) and positioned to left of W2-BASE-L3
  "PEN2-BASE-1": { pos: [-10.8, 1.25, 2.9], size: [1.25, 2.5, 2.6], type: 'cabinet', handleDir: 'right' },
  "PEN2-BASE-2": { pos: [-10.8, 1.25, 0.3], size: [1.25, 2.5, 2.6], type: 'cabinet', handleDir: 'right' },
  "PEN2-BASE-3": { pos: [-10.8, 1.25, -2.3], size: [1.25, 2.5, 2.6], type: 'cabinet', handleDir: 'right' },

  // ISLAND - Detached, centered between the two walls
  "ISL-1": { pos: [-3, 1.25, 0], size: [1.25, 2.5, 2.6], type: 'cabinet' },
  "ISL-2": { pos: [-1.5, 1.25, 0], size: [1.25, 2.5, 2.6], type: 'cabinet' },
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
  if (type === 'appliance') {
    if (unitId === 'FREEZER' || unitId === 'FRIDGE') return COLORS.applianceBlack;
    if (unitId === 'DISHWASHER') return COLORS.applianceWhite;
    if (unitId === 'STOVE') return COLORS.applianceBlack;
    return COLORS.stainless;
  }
  if (unitId.includes('UPPER') || unitId.includes('MICRO')) return COLORS.woodDark;
  if (unitId === 'PANTRY') return COLORS.applianceWhite;
  return COLORS.woodLight;
}

interface UnitMeshProps {
  unitId: string;
  label: string;
  isSelected: boolean;
  onClick: (unitId: string) => void;
}

function UnitMesh({ unitId, label, isSelected, onClick }: UnitMeshProps) {
  const [hovered, setHovered] = useState(false);
  const config = UNIT_POSITIONS[unitId];
  
  if (!config) return null;

  const { pos, size, type, handleDir = 'front' } = config;
  const color = getUnitColor(unitId, type);
  const isAppliance = type === 'appliance';

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(unitId);
  };

  const getHandleOffset = (): [number, number, number] => {
    switch (handleDir) {
      case 'front': return [0, 0, size[2] / 2 + 0.02];
      case 'back': return [0, 0, -size[2] / 2 - 0.02];
      case 'left': return [-size[0] / 2 - 0.02, 0, 0];
      case 'right': return [size[0] / 2 + 0.02, 0, 0];
    }
  };

  const handleRotation = (handleDir === 'left' || handleDir === 'right')
    ? [0, Math.PI / 2, 0] as [number, number, number]
    : [0, 0, 0] as [number, number, number];

  // Glass cabinet rendering
  if (type === 'glass') {
    return (
      <group position={pos}>
        <RoundedBox
          args={size}
          radius={0.02}
          smoothness={4}
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={isSelected ? "#c2410c" : hovered ? "#ea580c" : "#d4b896"}
            roughness={0.5}
            metalness={0.05}
          />
        </RoundedBox>
        <mesh position={[0, 0, size[2] * 0.3]}>
          <boxGeometry args={[size[0] * 0.75, size[1] * 0.7, 0.02]} />
          <meshStandardMaterial color="#b8d4e8" transparent opacity={0.25} roughness={0.05} />
        </mesh>
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground border border-border"
          }`}>{label}</div>
        </Html>
      </group>
    );
  }

  // Stove special rendering
  if (unitId === 'STOVE') {
    return (
      <group position={pos}>
        <mesh onClick={handleClick} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
          <boxGeometry args={size} />
          <meshStandardMaterial color={isSelected ? "#c2410c" : hovered ? "#ea580c" : color} roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Burners */}
        {[-0.5, 0.5].map((z, i) =>
          [-0.5, 0.5].map((x, j) => (
            <mesh key={`burner-${i}-${j}`} position={[0.1, 0.1, z + x * 0.7]}>
              <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
          ))
        )}
        <Html position={[0, 0.5, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground border border-border"
          }`}>{label}</div>
        </Html>
      </group>
    );
  }

  // Drawer unit rendering - 3 stacked drawers
  if (type === 'drawer') {
    const drawerHeight = size[1] / 3;
    const drawerColor = COLORS.applianceWhite;
    return (
      <group position={pos}>
        {[0, 1, 2].map((i) => (
          <group key={`drawer-${i}`} position={[0, size[1] / 2 - drawerHeight * (i + 0.5), 0]}>
            <RoundedBox
              args={[size[0], drawerHeight - 0.05, size[2]]}
              radius={0.02}
              smoothness={4}
              onClick={handleClick}
              onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
              onPointerOut={() => setHovered(false)}
            >
              <meshStandardMaterial
                color={isSelected ? "#c2410c" : hovered ? "#ea580c" : drawerColor}
                roughness={0.5}
                metalness={0.05}
              />
            </RoundedBox>
            {/* Drawer handle */}
            <mesh position={[0, 0, -size[2] / 2 - 0.02]}>
              <boxGeometry args={[size[0] * 0.4, 0.04, 0.02]} />
              <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
        <Html position={[0, size[1] / 2 + 0.25, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground border border-border"
          }`}>{label}</div>
        </Html>
      </group>
    );
  }

  // Regular cabinet/appliance
  return (
    <group position={pos}>
      <RoundedBox
        args={size}
        radius={0.03}
        smoothness={4}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
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
        <div className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
          isSelected ? "bg-primary text-primary-foreground" : hovered ? "bg-accent text-accent-foreground" : "bg-card/80 text-foreground border border-border"
        }`}>{label}</div>
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
      {/* Wall 1 - Back (Fridge/Pantry wall) */}
      <mesh position={[-2, 4, -6.5]}>
        <boxGeometry args={[18, 8, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-2, 7.85, -6.5]}>
        <boxGeometry args={[18, 0.3, 0.25]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      {/* Wall 2 - Front (Sink/Stove wall, parallel to Wall 1) */}
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
      {/* Wall 1 countertop - only covers W1-BASE-1 to W1-BASE-5 (not freezer/pantry/fridge) */}
      {/* W1-BASE-1 left edge: -2.25 - 0.625 = -2.875, W1-BASE-5 right edge: 3.15 + 0.625 = 3.775 */}
      {/* Center: (-2.875 + 3.775) / 2 = 0.45, Width: 3.775 - (-2.875) = 6.65 */}
      <mesh position={[0.45, 2.55, -5.5]}>
        <boxGeometry args={[6.65, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Wall 2 countertop - covers W2-BASE-L3 to W2-DRAWERS */}
      {/* W2-BASE-L3 left edge: -9.425 - 0.75 = -10.175, W2-DRAWERS right edge: 1.95 + 0.625 = 2.575 */}
      {/* Center: (-10.175 + 2.575) / 2 = -3.8, Width: 2.575 - (-10.175) = 12.75 */}
      <mesh position={[-3.8, 2.55, 5.5]}>
        <boxGeometry args={[12.75, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Peninsula 1 countertop - covers PEN1-BASE-1 to PEN1-BASE-3 */}
      <mesh position={[3.2, 2.55, 1.6]}>
        <boxGeometry args={[2, 0.08, 6]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Peninsula 2 countertop - covers PEN2-BASE-1 to PEN2-BASE-3 */}
      <mesh position={[-10.8, 2.55, 0.3]}>
        <boxGeometry args={[1.45, 0.08, 7.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
      {/* Island countertop */}
      <mesh position={[-2.25, 2.55, 0]}>
        <boxGeometry args={[3, 0.08, 2.8]} />
        <meshStandardMaterial color={COLORS.countertop} roughness={0.4} />
      </mesh>
    </>
  );
}

function Microwave() {
  return (
    <mesh position={[-2.5, 4, 5.5]}>
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
  // Collect all units from layout data
  const allUnits = kitchenLayout.flatMap(area => 
    area.units.filter(unit => unit.zones.length > 0 || unit.id === 'STOVE')
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

        {/* Render exactly what's in kitchenLayout */}
        {allUnits.map(unit => (
          <UnitMesh
            key={unit.id}
            unitId={unit.id}
            label={unit.label}
            isSelected={selectedUnitId === unit.id}
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
