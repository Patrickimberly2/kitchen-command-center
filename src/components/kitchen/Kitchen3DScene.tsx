import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

type ZoneType =
  | "upper_cabinet"
  | "lower_cabinet"
  | "drawer"
  | "pantry"
  | "refrigerator"
  | "freezer"
  | "island"
  | "peninsula"
  | "appliance"
  | "shelf"
  | "countertop";

type KitchenZone = {
  id: string;
  name: string;
  zone_type: ZoneType;
  position?: { x: number; y: number; z: number };
  dimensions?: { width: number; height: number; depth: number };
  color?: string | null;
};

type Kitchen3DSceneProps = {
  zones: KitchenZone[];
  selectedZone: KitchenZone | null;
  onSelectZone: (zone: KitchenZone) => void;
  itemCounts: Record<string, number>;
};

const zoneTypeConfig: Record<ZoneType, { defaultColor: string; hoverColor: string }> = {
  upper_cabinet: { defaultColor: "#e8dfd5", hoverColor: "#d4a574" },
  lower_cabinet: { defaultColor: "#d4ccc2", hoverColor: "#c9956c" },
  drawer: { defaultColor: "#c9c1b7", hoverColor: "#bf8a5e" },
  pantry: { defaultColor: "#e0d8ce", hoverColor: "#d4a574" },
  refrigerator: { defaultColor: "#f5f5f5", hoverColor: "#a8d5e5" },
  freezer: { defaultColor: "#e8f4f8", hoverColor: "#7bc4dc" },
  island: { defaultColor: "#dbd3c9", hoverColor: "#c9956c" },
  peninsula: { defaultColor: "#d8d0c6", hoverColor: "#c9956c" },
  appliance: { defaultColor: "#c0c0c0", hoverColor: "#a0a0a0" },
  shelf: { defaultColor: "#ebe3d9", hoverColor: "#d4a574" },
  countertop: { defaultColor: "#f0ebe4", hoverColor: "#e5d5c5" },
};

function KitchenZone3D({
  zone,
  isSelected,
  onSelect,
  itemCount,
}: {
  zone: KitchenZone;
  isSelected: boolean;
  onSelect: (zone: KitchenZone) => void;
  itemCount: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const config = zoneTypeConfig[zone.zone_type] || zoneTypeConfig.lower_cabinet;
  const position = zone.position || { x: 0, y: 0, z: 0 };
  const dimensions = zone.dimensions || { width: 1, height: 1, depth: 0.6 };
  const color = isSelected ? "#d4a574" : hovered ? config.hoverColor : zone.color || config.defaultColor;

  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = hovered || isSelected ? 1.02 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(zone);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
          transparent={hovered || isSelected}
          opacity={hovered || isSelected ? 0.95 : 1}
        />
      </mesh>

      {(zone.zone_type === "upper_cabinet" || zone.zone_type === "lower_cabinet") && (
        <mesh position={[0, 0, dimensions.depth / 2 + 0.002]}>
          <planeGeometry args={[dimensions.width * 0.9, dimensions.height * 0.9]} />
          <meshBasicMaterial color="#b0a090" opacity={0.15} transparent />
        </mesh>
      )}

      {zone.zone_type !== "countertop" && zone.zone_type !== "shelf" && (
        <mesh
          position={[0, zone.zone_type === "drawer" ? 0 : dimensions.height * 0.15, dimensions.depth / 2 + 0.02]}
        >
          <boxGeometry args={[dimensions.width * 0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#8a7a6a" metalness={0.6} roughness={0.3} />
        </mesh>
      )}

      {itemCount > 0 && (hovered || isSelected) && (
        <Html position={[dimensions.width / 2, dimensions.height / 2, dimensions.depth / 2]} distanceFactor={8}>
          <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
            {itemCount} items
          </div>
        </Html>
      )}

      {(hovered || isSelected) && (
        <Html position={[0, -dimensions.height / 2 - 0.15, dimensions.depth / 2]} distanceFactor={10}>
          <div className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-100">
            {zone.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#f5f0eb" roughness={0.8} />
    </mesh>
  );
}

function Walls() {
  return (
    <>
      <mesh position={[0, 0.5, -2]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.9} />
      </mesh>
      <mesh position={[-6, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#f8f5f2" roughness={0.9} />
      </mesh>
    </>
  );
}

function Countertop({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, 0.04, 0.65]} />
      <meshStandardMaterial color="#e8e0d5" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(5, 4, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

export default function Kitchen3DScene({
  zones,
  selectedZone,
  onSelectZone,
  itemCounts,
}: Kitchen3DSceneProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <CameraController />
        <PerspectiveCamera makeDefault fov={45} near={0.1} far={100} />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-3, 3, 2]} intensity={0.3} />

        <Suspense fallback={null}>
          <Floor />
          <Walls />
          <Countertop position={[-3.5, -0.48, -1.4]} width={5} />
          <Countertop position={[3.5, -0.48, -1.4]} width={3} />
          {zones.map((zone) => (
            <KitchenZone3D
              key={zone.id}
              zone={zone}
              isSelected={selectedZone?.id === zone.id}
              onSelect={onSelectZone}
              itemCount={itemCounts[zone.id] || 0}
            />
          ))}
        </Suspense>

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={15}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
