import React, { useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Html } from "@react-three/drei";

// Cabinet component for all cabinet types
interface CabinetProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  unitId: string;
  isSelected: boolean;
  onClick: (unitId: string) => void;
  handlePosition?: "front" | "left" | "right" | "back";
  isAppliance?: boolean;
}

function Cabinet({ 
  position, size, color, label, unitId, isSelected, onClick, 
  handlePosition = "front", isAppliance = false 
}: CabinetProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(unitId);
  };

  // Calculate handle offset based on position
  const getHandleOffset = (): [number, number, number] => {
    switch (handlePosition) {
      case "front": return [0, 0, size[2] / 2 + 0.02];
      case "back": return [0, 0, -size[2] / 2 - 0.02];
      case "left": return [-size[0] / 2 - 0.02, 0, 0];
      case "right": return [size[0] / 2 + 0.02, 0, 0];
    }
  };

  const handleRotation = handlePosition === "left" || handlePosition === "right" 
    ? [0, Math.PI / 2, 0] as [number, number, number]
    : [0, 0, 0] as [number, number, number];

  return (
    <group position={position}>
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
          roughness={isAppliance ? 0.2 : 0.4}
          metalness={isAppliance ? 0.6 : 0.1}
        />
      </RoundedBox>
      {/* Cabinet handle */}
      {!isAppliance && (
        <mesh position={getHandleOffset()} rotation={handleRotation}>
          <boxGeometry args={[size[0] * 0.25, 0.04, 0.02]} />
          <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      {/* Label */}
      <Html
        position={[0, size[1] / 2 + 0.25, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "none" }}
      >
        <div 
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap transition-colors ${
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

// Countertop component
function Countertop({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#78716c" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

// Wall component
function Wall({ position, rotation, size }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#fafaf9" roughness={0.9} />
    </mesh>
  );
}

// Floor component
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[25, 20]} />
      <meshStandardMaterial color="#f5f5f4" roughness={0.8} />
    </mesh>
  );
}

// Glass cabinet for display peninsula
function GlassCabinet({ 
  position, size, label, unitId, isSelected, onClick 
}: Omit<CabinetProps, 'color' | 'handlePosition' | 'isAppliance'>) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(unitId);
  };

  return (
    <group position={position}>
      {/* Frame */}
      <RoundedBox
        args={size}
        radius={0.02}
        smoothness={4}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isSelected ? "#c2410c" : hovered ? "#ea580c" : "#d6d3d1"}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.3}
        />
      </RoundedBox>
      {/* Glass panel simulation */}
      <mesh>
        <boxGeometry args={[size[0] * 0.9, size[1] * 0.8, size[2] * 0.02]} />
        <meshStandardMaterial color="#a8d8ea" transparent opacity={0.2} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Label */}
      <Html
        position={[0, size[1] / 2 + 0.25, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "none" }}
      >
        <div className={`rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
          isSelected ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground border border-border"
        }`}>
          {label}
        </div>
      </Html>
    </group>
  );
}

interface Kitchen3DProps {
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
}

export default function Kitchen3D({ selectedUnitId, onSelectUnit }: Kitchen3DProps) {
  // Color palette
  const baseColor = "#d6d3d1";
  const altColor = "#a8a29e";
  const applianceColor = "#e7e5e4";
  const stainlessColor = "#a1a1aa";

  return (
    <div className="h-[500px] w-full rounded-2xl border border-border bg-gradient-to-b from-stone-100 to-stone-50 overflow-hidden shadow-inner">
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#faf9f7"]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[8, 12, 8]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 6, -5]} intensity={0.3} />
        <pointLight position={[5, 6, 5]} intensity={0.3} />

        <Floor />

        {/* WALL 1 - Fridge & Pantry Wall (back wall, left section) */}
        <Wall position={[-4, 4, -6.5]} size={[16, 8, 0.2]} />

        {/* Upright Freezer */}
        <Cabinet
          position={[-10, 2.75, -5.5]}
          size={[2.6, 5.5, 2.5]}
          color={applianceColor}
          label="Freezer"
          unitId="FREEZER"
          isSelected={selectedUnitId === "FREEZER"}
          onClick={onSelectUnit}
          isAppliance
        />

        {/* Tall Pantry */}
        <Cabinet
          position={[-7, 3, -5.5]}
          size={[2.5, 6, 2.7]}
          color={baseColor}
          label="Pantry"
          unitId="PANTRY"
          isSelected={selectedUnitId === "PANTRY"}
          onClick={onSelectUnit}
        />

        {/* Main Fridge */}
        <Cabinet
          position={[-4, 2.75, -5.5]}
          size={[3, 5.5, 2.7]}
          color={applianceColor}
          label="Fridge"
          unitId="FRIDGE"
          isSelected={selectedUnitId === "FRIDGE"}
          onClick={onSelectUnit}
          isAppliance
        />

        {/* Above Fridge Cabinets */}
        <Cabinet
          position={[-4.75, 6, -5.5]}
          size={[1.25, 1.25, 1]}
          color={baseColor}
          label="Above L"
          unitId="FRIDGE-UPPER-L"
          isSelected={selectedUnitId === "FRIDGE-UPPER-L"}
          onClick={onSelectUnit}
        />
        <Cabinet
          position={[-3.25, 6, -5.5]}
          size={[1.25, 1.25, 1]}
          color={baseColor}
          label="Above R"
          unitId="FRIDGE-UPPER-R"
          isSelected={selectedUnitId === "FRIDGE-UPPER-R"}
          onClick={onSelectUnit}
        />

        {/* Wall 1 Upper Cabinets (5 cabinets, 15"W each) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Cabinet
            key={`W1-UPPER-${i + 1}`}
            position={[-1.5 + i * 1.35, 4.5, -5.5]}
            size={[1.25, 2.5, 1]}
            color={i % 2 === 0 ? baseColor : altColor}
            label={`Upper ${i + 1}`}
            unitId={`W1-UPPER-${i + 1}`}
            isSelected={selectedUnitId === `W1-UPPER-${i + 1}`}
            onClick={onSelectUnit}
          />
        ))}

        {/* Wall 1 Base Cabinets (5 cabinets, connected) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Cabinet
            key={`W1-BASE-${i + 1}`}
            position={[-1.5 + i * 1.35, 1.25, -5.5]}
            size={[1.25, 2.5, 2.6]}
            color={i % 2 === 0 ? baseColor : altColor}
            label={`Base ${i + 1}`}
            unitId={`W1-BASE-${i + 1}`}
            isSelected={selectedUnitId === `W1-BASE-${i + 1}`}
            onClick={onSelectUnit}
          />
        ))}
        {/* Countertop for Wall 1 base cabinets */}
        <Countertop position={[1.2, 2.55, -5.5]} size={[7, 0.08, 2.8]} />

        {/* WALL 2 - Sink & Stove Wall (left wall) */}
        <Wall position={[-11.5, 4, 0]} rotation={[0, Math.PI / 2, 0]} size={[14, 8, 0.2]} />

        {/* Two upper left cabinets */}
        <Cabinet
          position={[-10.5, 4.5, -2.5]}
          size={[1, 2.5, 1]}
          color={baseColor}
          label="Upper L1"
          unitId="W2-UPPER-L1"
          isSelected={selectedUnitId === "W2-UPPER-L1"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-10.5, 4.5, -1.4]}
          size={[1, 2.5, 1]}
          color={altColor}
          label="Upper L2"
          unitId="W2-UPPER-L2"
          isSelected={selectedUnitId === "W2-UPPER-L2"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* Drawer Stack */}
        <Cabinet
          position={[-10.5, 1.25, -2]}
          size={[1.25, 2.5, 1.5]}
          color={baseColor}
          label="Drawers"
          unitId="W2-DRAWERS"
          isSelected={selectedUnitId === "W2-DRAWERS"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* Sink Cabinet */}
        <Cabinet
          position={[-10.5, 1.25, 0]}
          size={[2, 2.5, 3]}
          color={altColor}
          label="Sink"
          unitId="SINK"
          isSelected={selectedUnitId === "SINK"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        {/* Sink basin */}
        <mesh position={[-10.35, 2.6, 0]}>
          <boxGeometry args={[0.15, 0.8, 2]} />
          <meshStandardMaterial color={stainlessColor} metalness={0.9} roughness={0.1} />
        </mesh>
        <Countertop position={[-10.5, 2.55, -0.5]} size={[2.2, 0.08, 5]} />

        {/* Dishwasher */}
        <Cabinet
          position={[-10.5, 1.25, 2]}
          size={[2, 2.5, 2]}
          color={stainlessColor}
          label="Dishwasher"
          unitId="DISHWASHER"
          isSelected={selectedUnitId === "DISHWASHER"}
          onClick={onSelectUnit}
          handlePosition="right"
          isAppliance
        />

        {/* Stove */}
        <mesh position={[-10.5, 2.6, 4]}>
          <boxGeometry args={[2, 0.15, 2.5]} />
          <meshStandardMaterial color="#1c1917" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Burners */}
        {[-0.6, 0.6].map((x, i) => 
          [-0.6, 0.6].map((z, j) => (
            <mesh key={`burner-${i}-${j}`} position={[-10.45, 2.7, 4 + x + z * 0.5]}>
              <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
              <meshStandardMaterial color="#44403c" metalness={0.8} />
            </mesh>
          ))
        )}

        {/* Microwave above stove */}
        <mesh position={[-10.5, 4, 4]}>
          <boxGeometry args={[1.5, 1.2, 2.5]} />
          <meshStandardMaterial color={stainlessColor} metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Above Microwave Cabinets */}
        <Cabinet
          position={[-10.5, 5.5, 3.4]}
          size={[1, 1.5, 1.2]}
          color={baseColor}
          label="Above Micro L"
          unitId="W2-MICRO-UPPER-L"
          isSelected={selectedUnitId === "W2-MICRO-UPPER-L"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-10.5, 5.5, 4.6]}
          size={[1, 1.5, 1.2]}
          color={altColor}
          label="Above Micro R"
          unitId="W2-MICRO-UPPER-R"
          isSelected={selectedUnitId === "W2-MICRO-UPPER-R"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* Base cabinets right of stove */}
        <Cabinet
          position={[-10.5, 1.25, 6]}
          size={[1.5, 2.5, 2.6]}
          color={baseColor}
          label="Base R1"
          unitId="W2-BASE-R1"
          isSelected={selectedUnitId === "W2-BASE-R1"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Countertop position={[-10.5, 2.55, 5.5]} size={[2.2, 0.08, 3.5]} />

        {/* PENINSULA 1 - Bar Wall (perpendicular, right angle from Wall 2) */}
        {/* Attaches to base cabinets right of stove, doors face kitchen (toward +X) */}
        <Cabinet
          position={[-8.5, 1.25, 6.8]}
          size={[1.5, 2.5, 2.6]}
          color={baseColor}
          label="Pen1-1"
          unitId="PEN1-BASE-1"
          isSelected={selectedUnitId === "PEN1-BASE-1"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-6.8, 1.25, 6.8]}
          size={[1.8, 2.5, 2.6]}
          color={altColor}
          label="Pen1-2"
          unitId="PEN1-BASE-2"
          isSelected={selectedUnitId === "PEN1-BASE-2"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-4.8, 1.25, 6.8]}
          size={[1.8, 2.5, 2.6]}
          color={baseColor}
          label="Pen1-3"
          unitId="PEN1-BASE-3"
          isSelected={selectedUnitId === "PEN1-BASE-3"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Countertop position={[-6.7, 2.55, 6.8]} size={[6.5, 0.08, 2.8]} />

        {/* PENINSULA 2 - Display Peninsula (perpendicular, left angle from Wall 1) */}
        {/* Base cabinets */}
        <Cabinet
          position={[5.5, 1.25, -3.5]}
          size={[1.5, 2.5, 2.6]}
          color={baseColor}
          label="Pen2-1"
          unitId="PEN2-BASE-1"
          isSelected={selectedUnitId === "PEN2-BASE-1"}
          onClick={onSelectUnit}
          handlePosition="left"
        />
        <Cabinet
          position={[5.5, 1.25, -1.5]}
          size={[1.8, 2.5, 2.6]}
          color={altColor}
          label="Pen2-2"
          unitId="PEN2-BASE-2"
          isSelected={selectedUnitId === "PEN2-BASE-2"}
          onClick={onSelectUnit}
          handlePosition="left"
        />
        <Cabinet
          position={[5.5, 1.25, 0.5]}
          size={[1.8, 2.5, 2.6]}
          color={baseColor}
          label="Pen2-3"
          unitId="PEN2-BASE-3"
          isSelected={selectedUnitId === "PEN2-BASE-3"}
          onClick={onSelectUnit}
          handlePosition="left"
        />
        <Countertop position={[5.5, 2.55, -1.5]} size={[2, 0.08, 7]} />

        {/* Peninsula 2 Upper Display Cabinets (glass doors) */}
        <GlassCabinet
          position={[5.5, 4.2, -3.2]}
          size={[1.25, 2, 1]}
          label="Display 1"
          unitId="PEN2-UPPER-1"
          isSelected={selectedUnitId === "PEN2-UPPER-1"}
          onClick={onSelectUnit}
        />
        <GlassCabinet
          position={[5.5, 4.2, -1.9]}
          size={[1.25, 2, 1]}
          label="Display 2"
          unitId="PEN2-UPPER-2"
          isSelected={selectedUnitId === "PEN2-UPPER-2"}
          onClick={onSelectUnit}
        />
        <GlassCabinet
          position={[5.5, 4.2, -0.6]}
          size={[1.25, 2, 1]}
          label="Display 3"
          unitId="PEN2-UPPER-3"
          isSelected={selectedUnitId === "PEN2-UPPER-3"}
          onClick={onSelectUnit}
        />
        <GlassCabinet
          position={[5.5, 4.2, 0.7]}
          size={[1.25, 2, 1]}
          label="Display 4"
          unitId="PEN2-UPPER-4"
          isSelected={selectedUnitId === "PEN2-UPPER-4"}
          onClick={onSelectUnit}
        />

        {/* ISLAND - Detached, centered */}
        <Cabinet
          position={[-2, 1.25, 2]}
          size={[1.25, 2.5, 2.6]}
          color={baseColor}
          label="Island 1"
          unitId="ISL-1"
          isSelected={selectedUnitId === "ISL-1"}
          onClick={onSelectUnit}
        />
        <Cabinet
          position={[-0.5, 1.25, 2]}
          size={[1.25, 2.5, 2.6]}
          color={altColor}
          label="Island 2"
          unitId="ISL-2"
          isSelected={selectedUnitId === "ISL-2"}
          onClick={onSelectUnit}
        />
        <Countertop position={[-1.25, 2.55, 2]} size={[3, 0.08, 2.8]} />

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
