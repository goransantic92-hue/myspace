"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useDoors } from "./SceneContext";
import { useInteraction } from "./stores";

export const DOORS = [
  { id: "door1", worldPos: [0.53306, 0, 1.91315], openAngle: Math.PI / 2 },
  { id: "door2", worldPos: [-0.92175, 0, 1.52575], openAngle: -Math.PI / 2 },
  { id: "door3", worldPos: [-0.92175, 0, 3.12153], openAngle: -Math.PI / 2 },
  { id: "door4", worldPos: [0.53306, 0, 3.373], openAngle: Math.PI / 2 },
  { id: "door5", worldPos: [3.60475, 0, -1.18485], openAngle: Math.PI / 2 },
  { id: "door6", worldPos: [-3.1486, 0, 4.7179], openAngle: -Math.PI / 2 },
];

const CENTER = new THREE.Vector2(0, 0);

function DoorBlocker({ doorId, position = [0, 0, 1.05], args = [0.45, 0.075, 1.05], debug = false }) {
  const { openDoors } = useDoors();
  const open = !!openDoors[doorId];
  return (
    <RigidBody key={open ? "open" : "closed"} type="fixed" colliders={false} position={position}>
      <CuboidCollider args={args} sensor={open} />
      {debug && (
        <mesh>
          <boxGeometry args={[2 * args[0], 2 * args[1], 2 * args[2]]} />
          <meshBasicMaterial color={open ? "lime" : "red"} transparent opacity={0.4} />
        </mesh>
      )}
    </RigidBody>
  );
}

function useDoor(config) {
  const { camera } = useThree();
  const { openDoors, setDoorOpen } = useDoors();
  const showHint = useInteraction((s) => s.showHint);
  const hideHint = useInteraction((s) => s.hideHint);
  const panelRef = useRef();
  const targetAngle = useRef(0);
  const currentAngle = useRef(0);
  const worldPos = useMemo(() => new THREE.Vector3(...config.worldPos), [config.worldPos]);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const [isNearby, setNearby] = useState(false);
  const isOpen = !!openDoors[config.id];

  const toggle = useCallback(() => {
    const next = !isOpen;
    targetAngle.current = next ? config.openAngle : 0;
    setDoorOpen(config.id, next);
    const audio = new Audio(next ? "/assets/audio/opening-door.mp3" : "/assets/audio/close-door.mp3");
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Audio play prevented:", e));
  }, [isOpen, config.id, config.openAngle, setDoorOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "e" && isNearby) toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isNearby, toggle]);

  useEffect(() => {
    if (isNearby) showHint(isOpen ? "door-close" : "door-open");
    else if (useInteraction.getState().activeInteraction?.startsWith("door")) hideHint();
  }, [isNearby, isOpen, showHint, hideHint]);

  useFrame((_, delta) => {
    let near = false;
    if (camera.position.distanceTo(worldPos) < 2.5 && panelRef.current) {
      raycaster.setFromCamera(CENTER, camera);
      if (raycaster.intersectObject(panelRef.current, true).length > 0) near = true;
    }
    if (near !== isNearby) setNearby(near);
    const diff = targetAngle.current - currentAngle.current;
    if (Math.abs(diff) > 5e-4 && panelRef.current) {
      currentAngle.current += 3.5 * diff * delta;
      panelRef.current.rotation.z = currentAngle.current;
    }
  });

  return { panelRef, isOpen, isNearby, toggle };
}

export default function Door({ config, panelGeometry, handleGeometry, doorMat, handleMat, panelPos, handlePos }) {
  const { panelRef, isNearby, toggle } = useDoor(config);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "e" && isNearby && hovered) toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isNearby, hovered, toggle]);

  return (
    <>
      <group
        position={panelPos}
        ref={panelRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          if (!isNearby) return;
          e.stopPropagation();
          toggle();
        }}
      >
        <mesh castShadow receiveShadow geometry={panelGeometry} material={doorMat} />
        <mesh castShadow receiveShadow geometry={handleGeometry} material={handleMat} position={handlePos} />
      </group>
      <DoorBlocker doorId={config.id} position={[0, 0, 1.05]} />
    </>
  );
}
