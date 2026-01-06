import React, { useState, useRef } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

interface CabinetProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  unitId: string;
  isSelected: boolean;
  onClick: (unitId: string) => void;
}

function Cabinet({ position, size, color, label, unitId, isSelected, onClick }: CabinetProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(unitId);
  };

  return (
    <group position={position}>
      <RoundedBox
        args={size}
        radius={0.05}
        smoothness={4}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isSelected ? "#c2410c" : hovered ? "#ea580c" : color}
          roughness={0.4}
          metalness={0.1}
        />
      </RoundedBox>
      {/* Cabinet handle */}
      <mesh position={[0, 0, size[2] / 2 + 0.02]}>
        <boxGeometry args={[size[0] * 0.3, 0.05, 0.03]} />
        <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Label using Html */}
      <Html
        position={[0, size[1] / 2 + 0.3, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div 
          className={`rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-card/90 text-foreground border border-border"
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
      <planeGeometry args={[12, 10]} />
      <meshStandardMaterial color="#f5f5f4" roughness={0.8} />
    </mesh>
  );
}

function Countertop({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#78716c" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

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

interface Kitchen3DProps {
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
}

export default function Kitchen3D({ selectedUnitId, onSelectUnit }: Kitchen3DProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl border border-border bg-gradient-to-b from-stone-100 to-stone-50 overflow-hidden shadow-inner">
      <Canvas
        shadows
        camera={{ position: [6, 6, 6], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#faf9f7"]} />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-3, 4, -3]} intensity={0.4} />

        {/* Floor */}
        <Floor />

        {/* Walls */}
        <Wall position={[0, 1.5, -4.5]} size={[12, 3, 0.2]} />
        <Wall position={[-5.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[10, 3, 0.2]} />

        {/* WALL-1: Fridge & Pantry (back left) */}
        <Cabinet
          position={[-4, 0.6, -3.5]}
          size={[1.2, 1.2, 0.7]}
          color="#d6d3d1"
          label="Pantry"
          unitId="PANTRY"
          isSelected={selectedUnitId === "PANTRY"}
          onClick={onSelectUnit}
        />
        <Countertop position={[-4, 1.25, -3.5]} size={[1.3, 0.05, 0.8]} />
        
        <Cabinet
          position={[-2.5, 0.6, -3.5]}
          size={[1, 1.2, 0.7]}
          color="#a8a29e"
          label="Freezer"
          unitId="FREEZER"
          isSelected={selectedUnitId === "FREEZER"}
          onClick={onSelectUnit}
        />
        <Countertop position={[-2.5, 1.25, -3.5]} size={[1.1, 0.05, 0.8]} />

        {/* WALL-2: Sink & Stove (back right) */}
        <Cabinet
          position={[-0.5, 0.6, -3.5]}
          size={[1.2, 1.2, 0.7]}
          color="#d6d3d1"
          label="Drawers"
          unitId="DRAWERS"
          isSelected={selectedUnitId === "DRAWERS"}
          onClick={onSelectUnit}
        />
        <Countertop position={[-0.5, 1.25, -3.5]} size={[1.3, 0.05, 0.8]} />

        <Cabinet
          position={[1.2, 0.6, -3.5]}
          size={[1.4, 1.2, 0.7]}
          color="#a8a29e"
          label="Sink"
          unitId="SINK"
          isSelected={selectedUnitId === "SINK"}
          onClick={onSelectUnit}
        />
        <Countertop position={[1.2, 1.25, -3.5]} size={[1.5, 0.05, 0.8]} />
        {/* Sink basin */}
        <mesh position={[1.2, 1.28, -3.5]}>
          <boxGeometry args={[0.8, 0.02, 0.5]} />
          <meshStandardMaterial color="#57534e" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Peninsula 1 (left side) */}
        <Cabinet
          position={[-4.5, 0.6, -1]}
          size={[0.7, 1.2, 1.5]}
          color="#d6d3d1"
          label="Peninsula 1"
          unitId="PEN1"
          isSelected={selectedUnitId === "PEN1"}
          onClick={onSelectUnit}
        />
        <Countertop position={[-4.5, 1.25, -1]} size={[0.8, 0.05, 1.6]} />

        {/* Peninsula 2 (left side, lower) */}
        <Cabinet
          position={[-4.5, 0.6, 1]}
          size={[0.7, 1.2, 1.5]}
          color="#a8a29e"
          label="Peninsula 2"
          unitId="PEN2"
          isSelected={selectedUnitId === "PEN2"}
          onClick={onSelectUnit}
        />
        <Countertop position={[-4.5, 1.25, 1]} size={[0.8, 0.05, 1.6]} />

        {/* Island (center) */}
        <Cabinet
          position={[0, 0.6, 0.5]}
          size={[2.5, 1.2, 1.2]}
          color="#d6d3d1"
          label="Island"
          unitId="ISL"
          isSelected={selectedUnitId === "ISL"}
          onClick={onSelectUnit}
        />
        <Countertop position={[0, 1.25, 0.5]} size={[2.6, 0.05, 1.3]} />

        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={4}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
