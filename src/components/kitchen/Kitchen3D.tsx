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
          roughness={isAppliance ? 0.2 : 0.6}
          metalness={isAppliance ? 0.6 : 0.05}
        />
      </RoundedBox>
      {/* Cabinet handle */}
      {!isAppliance && (
        <mesh position={getHandleOffset()} rotation={handleRotation}>
          <boxGeometry args={[size[0] * 0.2, 0.04, 0.02]} />
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

// Countertop component - tan/beige like reference
function Countertop({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#c9a882" roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

// Wall component with dark gray trim at top
function Wall({ position, rotation, size }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <group>
      {/* Main wall - white */}
      <mesh position={position} rotation={rotation || [0, 0, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Dark gray trim at top */}
      <mesh 
        position={[position[0], position[1] + size[1] / 2 - 0.15, position[2]]} 
        rotation={rotation || [0, 0, 0]}
      >
        <boxGeometry args={[size[0], 0.3, size[2] + 0.05]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Floor component - dark wood texture
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[25, 20]} />
      <meshStandardMaterial color="#5d4e3c" roughness={0.7} />
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

  // Light tan wood frame with glass
  return (
    <group position={position}>
      {/* Frame - light tan wood */}
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
      {/* Glass panel simulation */}
      <mesh position={[0, 0, size[2] * 0.3]}>
        <boxGeometry args={[size[0] * 0.75, size[1] * 0.7, size[2] * 0.02]} />
        <meshStandardMaterial color="#b8d4e8" transparent opacity={0.25} roughness={0.05} metalness={0.1} />
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
  // Warm wood color palette matching reference images
  const woodDark = "#8b4513";     // Dark reddish-brown wood (upper cabinets)
  const woodMedium = "#a0522d";   // Medium brown wood
  const woodLight = "#c9a66b";    // Light tan wood (base cabinets, island)
  const applianceBlack = "#1a1a1a"; // Black appliances
  const applianceWhite = "#f5f5f5"; // White appliances

  return (
    <div className="h-[500px] w-full rounded-2xl border border-border bg-gradient-to-b from-muted to-background overflow-hidden shadow-inner">
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#f5f5f5"]} />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[8, 12, 8]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 6, -5]} intensity={0.4} />
        <pointLight position={[5, 6, 5]} intensity={0.4} />

        <Floor />

        {/* WALL 1 - Fridge & Pantry Wall (back wall) */}
        <Wall position={[-4, 4, -6.5]} size={[16, 8, 0.2]} />

        {/* Upright Freezer - BLACK */}
        <Cabinet
          position={[-10, 2.75, -5.5]}
          size={[2.6, 5.5, 2.5]}
          color={applianceBlack}
          label="Freezer"
          unitId="FREEZER"
          isSelected={selectedUnitId === "FREEZER"}
          onClick={onSelectUnit}
          isAppliance
        />

        {/* Tall Pantry - WHITE door with handle */}
        <Cabinet
          position={[-7, 3, -5.5]}
          size={[2.5, 6, 2.7]}
          color={applianceWhite}
          label="Pantry"
          unitId="PANTRY"
          isSelected={selectedUnitId === "PANTRY"}
          onClick={onSelectUnit}
        />

        {/* Main Fridge - BLACK */}
        <Cabinet
          position={[-4, 2.75, -5.5]}
          size={[3, 5.5, 2.7]}
          color={applianceBlack}
          label="Fridge"
          unitId="FRIDGE"
          isSelected={selectedUnitId === "FRIDGE"}
          onClick={onSelectUnit}
          isAppliance
        />

        {/* Above Fridge Cabinets - dark wood */}
        <Cabinet
          position={[-4.75, 6, -5.5]}
          size={[1.25, 1.25, 1]}
          color={woodDark}
          label="Above L"
          unitId="FRIDGE-UPPER-L"
          isSelected={selectedUnitId === "FRIDGE-UPPER-L"}
          onClick={onSelectUnit}
        />
        <Cabinet
          position={[-3.25, 6, -5.5]}
          size={[1.25, 1.25, 1]}
          color={woodDark}
          label="Above R"
          unitId="FRIDGE-UPPER-R"
          isSelected={selectedUnitId === "FRIDGE-UPPER-R"}
          onClick={onSelectUnit}
        />

        {/* Wall 1 Upper Cabinets - dark reddish wood */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Cabinet
            key={`W1-UPPER-${i + 1}`}
            position={[-1.5 + i * 1.35, 4.5, -5.5]}
            size={[1.25, 2.5, 1]}
            color={woodDark}
            label={`Upper ${i + 1}`}
            unitId={`W1-UPPER-${i + 1}`}
            isSelected={selectedUnitId === `W1-UPPER-${i + 1}`}
            onClick={onSelectUnit}
          />
        ))}

        {/* Wall 1 Base Cabinets - light tan wood */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Cabinet
            key={`W1-BASE-${i + 1}`}
            position={[-1.5 + i * 1.35, 1.25, -5.5]}
            size={[1.25, 2.5, 2.6]}
            color={woodLight}
            label={`Base ${i + 1}`}
            unitId={`W1-BASE-${i + 1}`}
            isSelected={selectedUnitId === `W1-BASE-${i + 1}`}
            onClick={onSelectUnit}
          />
        ))}
        <Countertop position={[1.2, 2.55, -5.5]} size={[7, 0.08, 2.8]} />

        {/* WALL 2 - Sink & Stove Wall (left wall) */}
        <Wall position={[-11.5, 4, 0]} rotation={[0, Math.PI / 2, 0]} size={[14, 8, 0.2]} />

        {/* Two upper left cabinets - dark wood */}
        <Cabinet
          position={[-10.5, 4.5, -2.5]}
          size={[1, 2.5, 1]}
          color={woodDark}
          label="Upper L1"
          unitId="W2-UPPER-L1"
          isSelected={selectedUnitId === "W2-UPPER-L1"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-10.5, 4.5, -1.4]}
          size={[1, 2.5, 1]}
          color={woodDark}
          label="Upper L2"
          unitId="W2-UPPER-L2"
          isSelected={selectedUnitId === "W2-UPPER-L2"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* Drawer Stack - dark wood */}
        <Cabinet
          position={[-10.5, 1.25, -2]}
          size={[1.25, 2.5, 1.5]}
          color={woodMedium}
          label="Drawers"
          unitId="W2-DRAWERS"
          isSelected={selectedUnitId === "W2-DRAWERS"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* Sink Cabinet - dark wood */}
        <Cabinet
          position={[-10.5, 1.25, 0]}
          size={[2, 2.5, 3]}
          color={woodMedium}
          label="Sink"
          unitId="SINK"
          isSelected={selectedUnitId === "SINK"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        {/* Sink basin - stainless */}
        <mesh position={[-10.35, 2.6, 0]}>
          <boxGeometry args={[0.15, 0.5, 1.5]} />
          <meshStandardMaterial color="#a0a0a0" metalness={0.9} roughness={0.1} />
        </mesh>
        <Countertop position={[-10.5, 2.55, -0.5]} size={[2.2, 0.08, 5]} />

        {/* Dishwasher - WHITE */}
        <Cabinet
          position={[-10.5, 1.25, 2]}
          size={[2, 2.5, 2]}
          color={applianceWhite}
          label="Dishwasher"
          unitId="DISHWASHER"
          isSelected={selectedUnitId === "DISHWASHER"}
          onClick={onSelectUnit}
          handlePosition="right"
          isAppliance
        />

        {/* Stove - BLACK cooktop */}
        <mesh position={[-10.5, 2.6, 4]}>
          <boxGeometry args={[2, 0.15, 2.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Burners */}
        {[-0.5, 0.5].map((z, i) => 
          [-0.5, 0.5].map((x, j) => (
            <mesh key={`burner-${i}-${j}`} position={[-10.45, 2.72, 4 + z + x * 0.7]}>
              <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
          ))
        )}
        {/* Stove front controls */}
        <mesh position={[-10.2, 2.4, 4]}>
          <boxGeometry args={[0.5, 0.25, 2.5]} />
          <meshStandardMaterial color={applianceWhite} roughness={0.3} />
        </mesh>

        {/* Microwave above stove - dark/purple like reference */}
        <mesh position={[-10.5, 4, 4]}>
          <boxGeometry args={[1.5, 1.2, 2.5]} />
          <meshStandardMaterial color="#4a4063" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Above Microwave Cabinets - dark wood */}
        <Cabinet
          position={[-10.5, 5.5, 3.4]}
          size={[1, 1.5, 1.2]}
          color={woodDark}
          label="Above Micro L"
          unitId="W2-MICRO-UPPER-L"
          isSelected={selectedUnitId === "W2-MICRO-UPPER-L"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-10.5, 5.5, 4.6]}
          size={[1, 1.5, 1.2]}
          color={woodDark}
          label="Above Micro R"
          unitId="W2-MICRO-UPPER-R"
          isSelected={selectedUnitId === "W2-MICRO-UPPER-R"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* Base cabinet right of stove - dark wood */}
        <Cabinet
          position={[-10.5, 1.25, 6]}
          size={[1.5, 2.5, 2.6]}
          color={woodMedium}
          label="Base R1"
          unitId="W2-BASE-R1"
          isSelected={selectedUnitId === "W2-BASE-R1"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Countertop position={[-10.5, 2.55, 5.5]} size={[2.2, 0.08, 3.5]} />

        {/* Upper cabinets right of stove - dark wood */}
        <Cabinet
          position={[-10.5, 4.5, 5.5]}
          size={[1, 2.5, 1.25]}
          color={woodDark}
          label="Upper R1"
          unitId="W2-UPPER-R1"
          isSelected={selectedUnitId === "W2-UPPER-R1"}
          onClick={onSelectUnit}
          handlePosition="right"
        />
        <Cabinet
          position={[-10.5, 4.5, 6.8]}
          size={[1, 2.5, 1.25]}
          color={woodDark}
          label="Upper R2"
          unitId="W2-UPPER-R2"
          isSelected={selectedUnitId === "W2-UPPER-R2"}
          onClick={onSelectUnit}
          handlePosition="right"
        />

        {/* PENINSULA 1 - Bar Wall (perpendicular from Wall 2) */}
        <Cabinet
          position={[-8.5, 1.25, 6.8]}
          size={[1.5, 2.5, 2.6]}
          color={woodLight}
          label="Pen1-1"
          unitId="PEN1-BASE-1"
          isSelected={selectedUnitId === "PEN1-BASE-1"}
          onClick={onSelectUnit}
          handlePosition="front"
        />
        <Cabinet
          position={[-6.8, 1.25, 6.8]}
          size={[1.8, 2.5, 2.6]}
          color={woodLight}
          label="Pen1-2"
          unitId="PEN1-BASE-2"
          isSelected={selectedUnitId === "PEN1-BASE-2"}
          onClick={onSelectUnit}
          handlePosition="front"
        />
        <Cabinet
          position={[-4.8, 1.25, 6.8]}
          size={[1.8, 2.5, 2.6]}
          color={woodLight}
          label="Pen1-3"
          unitId="PEN1-BASE-3"
          isSelected={selectedUnitId === "PEN1-BASE-3"}
          onClick={onSelectUnit}
          handlePosition="front"
        />
        <Countertop position={[-6.7, 2.55, 6.8]} size={[6.5, 0.08, 2.8]} />

        {/* PENINSULA 2 - Display Peninsula with glass uppers */}
        <Cabinet
          position={[5.5, 1.25, -3.5]}
          size={[1.5, 2.5, 2.6]}
          color={woodLight}
          label="Pen2-1"
          unitId="PEN2-BASE-1"
          isSelected={selectedUnitId === "PEN2-BASE-1"}
          onClick={onSelectUnit}
          handlePosition="left"
        />
        <Cabinet
          position={[5.5, 1.25, -1.5]}
          size={[1.8, 2.5, 2.6]}
          color={woodLight}
          label="Pen2-2"
          unitId="PEN2-BASE-2"
          isSelected={selectedUnitId === "PEN2-BASE-2"}
          onClick={onSelectUnit}
          handlePosition="left"
        />
        <Cabinet
          position={[5.5, 1.25, 0.5]}
          size={[1.8, 2.5, 2.6]}
          color={woodLight}
          label="Pen2-3"
          unitId="PEN2-BASE-3"
          isSelected={selectedUnitId === "PEN2-BASE-3"}
          onClick={onSelectUnit}
          handlePosition="left"
        />
        <Countertop position={[5.5, 2.55, -1.5]} size={[2, 0.08, 7]} />

        {/* Peninsula 2 Upper Display Cabinets (glass doors) - light tan frame */}
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

        {/* ISLAND - Detached, centered - dark wood */}
        <Cabinet
          position={[-2, 1.25, 2]}
          size={[1.25, 2.5, 2.6]}
          color={woodMedium}
          label="Island 1"
          unitId="ISL-1"
          isSelected={selectedUnitId === "ISL-1"}
          onClick={onSelectUnit}
        />
        <Cabinet
          position={[-0.5, 1.25, 2]}
          size={[1.25, 2.5, 2.6]}
          color={woodMedium}
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
