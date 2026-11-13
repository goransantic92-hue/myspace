"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const MODEL = "/assets/models/vill_draco.glb";

export const STRUCTURE_GROUPS = [
  { label: "Walls", members: ["walls", "outerwalls"] },
  { label: "Floor", members: ["floor"] },
  { label: "Roof", members: ["toproof", "outerroof"] },
  { label: "Pillars", members: ["pillers"] },
  { label: "Stairs", members: ["stairs", "stairfull", "stairmainframe", "stairsframe"] },
  {
    label: "Windows & Doors",
    members: ["windowframe", "doorandwindowframe", "windowandroofglass"],
  },
];

function EdgeLines({ geometry, targetOpacity, color = "#354F79" }) {
  const material = useRef();
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry]);
  useFrame((_, delta) => {
    if (material.current) {
      material.current.opacity = THREE.MathUtils.lerp(
        material.current.opacity,
        targetOpacity,
        4 * delta,
      );
    }
  });
  return (
    <lineSegments geometry={edges} frustumCulled={false}>
      <lineBasicMaterial
        ref={material}
        color={color}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </lineSegments>
  );
}

function FadingMesh({ geometry, material, targetOpacity }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    const current = ref.current.opacity ?? 1;
    const next = THREE.MathUtils.lerp(current, targetOpacity, 4 * delta);
    ref.current.opacity = next;
    ref.current.transparent = next < 0.99;
    ref.current.depthWrite = next >= 0.99;
  });
  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <primitive object={material} ref={ref} attach="material" />
    </mesh>
  );
}

export default function VillaModel({ activeGroupIndex = "full", ...props }) {
  const { nodes, materials } = useGLTF(MODEL, true);
  const meshNames = useMemo(
    () => Object.keys(nodes).filter((name) => nodes[name].isMesh),
    [nodes],
  );

  useEffect(() => {
    Object.values(materials).forEach((m) => {
      m.side = THREE.DoubleSide;
    });
  }, [materials]);

  const isFull = activeGroupIndex === "full";
  const group = isFull ? null : STRUCTURE_GROUPS[activeGroupIndex];
  const isActive = (name) => isFull || (!!group && group.members.includes(name));

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI, 0, 0]} scale={0.022}>
        {meshNames.map((name) => (
          <FadingMesh
            key={`solid-${name}`}
            geometry={nodes[name].geometry}
            material={nodes[name].material}
            targetOpacity={isActive(name) ? 1 : 0.025}
          />
        ))}
        {!isFull &&
          meshNames.map((name) => (
            <EdgeLines
              key={`wire-${name}`}
              geometry={nodes[name].geometry}
              targetOpacity={isActive(name) ? 1 : 0.09}
            />
          ))}
      </group>
    </group>
  );
}

useGLTF.preload(MODEL, true);
