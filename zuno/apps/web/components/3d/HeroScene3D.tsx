"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Organic 3D Floating Fresh Leaf Component
interface LeafProps {
  position: [number, number, number];
  scale?: number;
  rotSpeed?: number;
  flutterSpeed?: number;
  phase?: number;
  color?: string;
}

function FloatingLeaf({
  position,
  scale = 0.35,
  rotSpeed = 0.4,
  flutterSpeed = 1.2,
  phase = 0,
  color = "#22A06B",
}: LeafProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Generate organic leaf shape geometry
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.6);
    shape.bezierCurveTo(0.4, -0.3, 0.45, 0.3, 0, 0.6);
    shape.bezierCurveTo(-0.45, 0.3, -0.4, -0.3, 0, -0.6);

    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.01,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() + phase;

    // Organic floating & fluttering motion
    meshRef.current.position.y = position[1] + Math.sin(t * flutterSpeed) * 0.12;
    meshRef.current.position.x = position[0] + Math.cos(t * (flutterSpeed * 0.7)) * 0.08;

    meshRef.current.rotation.x = Math.sin(t * rotSpeed) * 0.35;
    meshRef.current.rotation.y = Math.cos(t * (rotSpeed * 0.8)) * 0.4;
    meshRef.current.rotation.z = Math.sin(t * (rotSpeed * 0.5)) * 0.25;
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <mesh geometry={leafGeometry}>
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 2. Soft Ambient Halo (Subtle, non-intrusive glow behind the subject)
function AmbientHalo() {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!haloRef.current) return;
    const t = state.clock.getElapsedTime();
    haloRef.current.rotation.z = t * 0.03;
    const s = 1 + Math.sin(t * 0.8) * 0.04;
    haloRef.current.scale.set(s, s, 1);
  });

  return (
    <group position={[0, 0, -1]}>
      {/* Soft, ultra-subtle ring */}
      <mesh ref={haloRef}>
        <ringGeometry args={[1.6, 2.1, 64]} />
        <meshBasicMaterial
          color="#A7D56B"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 3. Gentle Floating Atmospheric Motes (Sunlight & Nature Particles)
function AmbientMotes() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 24;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#0F5D3A"),
      new THREE.Color("#22A06B"),
      new THREE.Color("#A7D56B"),
      new THREE.Color("#F3F9EE"),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.015) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

// 4. Parallax Camera & Rig responding smoothly to Pointer
function SceneRig({
  pointerPos,
  children,
}: {
  pointerPos: { x: number; y: number };
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const targetRotY = pointerPos.x * 0.08;
    const targetRotX = -pointerPos.y * 0.08;
    const targetPosX = pointerPos.x * 0.15;
    const targetPosY = pointerPos.y * 0.1;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      3,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3,
      delta
    );
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetPosX,
      3,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosY,
      3,
      delta
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

export interface HeroScene3DProps {
  pointerX?: number;
  pointerY?: number;
}

export function HeroScene3D({ pointerX = 0, pointerY = 0 }: HeroScene3DProps) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 4]} intensity={1.1} />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#A7D56B" />

        <Suspense fallback={null}>
          <SceneRig pointerPos={{ x: pointerX, y: pointerY }}>
            {/* Soft Ambient Halo behind the composition */}
            <AmbientHalo />

            {/* Organic 3D Floating Fresh Leaves */}
            {/* Top-Right fluttering leaf */}
            <FloatingLeaf
              position={[1.8, 1.2, 0.2]}
              scale={0.42}
              rotSpeed={0.5}
              flutterSpeed={1.1}
              phase={0.5}
              color="#22A06B"
            />

            {/* Bottom-Left subtle leaf */}
            <FloatingLeaf
              position={[-1.7, -1.0, 0.3]}
              scale={0.35}
              rotSpeed={0.4}
              flutterSpeed={1.3}
              phase={2.1}
              color="#1B8756"
            />

            {/* Top-Left small accent leaf */}
            <FloatingLeaf
              position={[-1.5, 1.3, -0.2]}
              scale={0.28}
              rotSpeed={0.6}
              flutterSpeed={0.9}
              phase={3.8}
              color="#A7D56B"
            />

            {/* Bottom-Right floating leaf */}
            <FloatingLeaf
              position={[1.9, -0.9, 0.1]}
              scale={0.32}
              rotSpeed={0.45}
              flutterSpeed={1.2}
              phase={5.0}
              color="#0F5D3A"
            />

            {/* Ambient Nature Motes */}
            <AmbientMotes />
          </SceneRig>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene3D;
