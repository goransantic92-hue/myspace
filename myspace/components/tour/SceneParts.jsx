"use client";

import { Component, useDeferredValue, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useFurniture, useInteraction } from "./stores";
import { useRoom } from "./SceneContext";

const APARTMENT = "/assets/models/apartment.glb";

export function WallsAndFloor(props) {
  const { nodes, materials } = useGLTF(APARTMENT);
  const wallColor = useInteraction((s) => s.wallColor);
  const floorColor = useInteraction((s) => s.floorColor);
  const wallTarget = useMemo(() => new THREE.Color(), []);
  const floorTarget = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (materials.Walls) {
      wallTarget.set(wallColor);
      materials.Walls.color.lerp(wallTarget, 5 * delta);
    }
    if (materials.Floor) {
      floorTarget.set(floorColor);
      materials.Floor.color.lerp(floorTarget, 5 * delta);
    }
  });

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            name="walls"
            castShadow
            receiveShadow
            geometry={nodes.walls_Walls_0.geometry}
            material={materials.Walls}
          />
          <mesh
            name="floor"
            castShadow
            receiveShadow
            geometry={nodes.walls_Floor_0.geometry}
            material={materials.Floor}
          />
        </group>
      </group>
    </group>
  );
}

const GROUND = [
  "/assets/textures/ground/ground_05_baseColor_1k.jpg",
  "/assets/textures/ground/ground_05_ambientOcclusion_1k.jpg",
  "/assets/textures/ground/ground_05_height_1k.jpg",
  "/assets/textures/ground/ground_05_metallic_1k.jpg",
  "/assets/textures/ground/ground_05_normal_gl_1k.jpg",
  "/assets/textures/ground/ground_05_roughness_1k.jpg",
];

const YARD = [
  "/assets/textures/yard/ground_tiles_21_baseColor_1k.jpg",
  "/assets/textures/yard/ground_tiles_21_ambientOcclusion_1k.jpg",
  "/assets/textures/yard/ground_tiles_21_height_1k.jpg",
  "/assets/textures/yard/ground_tiles_21_metallic_1k.jpg",
  "/assets/textures/yard/ground_tiles_21_normal_gl_1k.jpg",
  "/assets/textures/yard/ground_tiles_21_roughness_1k.jpg",
];

const repeat = (n) => (tex) => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(n, n);
};

export function Ground() {
  const [map, ao, height, metal, normal, rough] = useTexture(GROUND);
  [map, ao, height, metal, normal, rough].forEach(repeat(25));
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -0.08, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[100, 0.1, 100]} />
        <meshStandardMaterial
          map={map}
          aoMap={ao}
          aoMapIntensity={1}
          displacementMap={height}
          displacementScale={0.03}
          metalnessMap={metal}
          metalness={0.1}
          normalMap={normal}
          roughnessMap={rough}
          roughness={0.8}
        />
      </mesh>
    </RigidBody>
  );
}

export function Yard() {
  const [map, ao, height, metal, normal, rough] = useTexture(YARD);
  [map, ao, height, metal, normal, rough].forEach(repeat(12));
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0.5, -0.08, 0.9]}>
      <mesh receiveShadow>
        <boxGeometry args={[12.7, 0.12, 13.86]} />
        <meshStandardMaterial
          map={map}
          aoMap={ao}
          displacementMap={height}
          displacementScale={0.02}
          metalnessMap={metal}
          metalness={0.1}
          normalMap={normal}
          roughnessMap={rough}
          roughness={0.7}
        />
      </mesh>
    </RigidBody>
  );
}

class VariantBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidUpdate(prev) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }
  componentDidCatch(err) {
    console.warn("A model variant failed to load, using the default.", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const VARIANTS = {
  bed: {
    name: "bed",
    fallback: "bed1",
    select: (s) => s.selectedBed,
    items: {
      bed1: { path: "/assets/models/bed1.glb", position: [6, 0, 1.25], rotation: [0, Math.PI, 0], scale: [1.3, 1, 1] },
      bed2: { path: "/assets/models/bed2.glb", position: [3.8, -0.1, 1], rotation: [0, -Math.PI / 2, 0], scale: [0.4, 0.4, 0.45] },
      bed3: { path: "/assets/models/bed3.glb", position: [3.8, -0.1, 1], rotation: [0, -Math.PI / 2, 0], scale: [1, 1.1, 1.2] },
    },
  },
  smallbed: {
    name: "smallbed",
    fallback: "smallbed1",
    select: (s) => s.selectedSmallBed,
    items: {
      smallbed1: { path: "/assets/models/smallbed1.glb", position: [3.5, 0, 3.4], rotation: [0, -Math.PI / 2, 0], scale: [0.5, 0.4, 0.5] },
      smallbed2: { path: "/assets/models/smallbed2.glb", position: [3.6, 0, 3.4], rotation: [0, -Math.PI / 2, 0], scale: [0.5, 0.4, 0.5] },
    },
  },
  cupboard: {
    name: "cupboard",
    fallback: "cupboard1",
    select: (s) => s.selectedCupboard || "cupboard1",
    items: {
      cupboard1: { path: "/assets/models/cupboard1.glb", position: [1, 0, 0.6], rotation: [0, 0, 0], scale: 1 },
      cupboard2: { path: "/assets/models/cupboard2.glb", position: [1.35, 0, 0.5], rotation: [0, -Math.PI / 2, 0], scale: 1 },
    },
  },
  tv: {
    name: "tv",
    fallback: "tv1",
    select: (s) => s.selectedTv || "tv1",
    items: {
      tv1: { path: "/assets/models/tv1.glb", position: [-2, 0, -0.25], rotation: [0, Math.PI / 2, 0], scale: 0.175 },
      tv2: { path: "/assets/models/tv2.glb", position: [-2, 0, -0.25], rotation: [0, Math.PI / 2, 0], scale: 1.2 },
      tv3: { path: "/assets/models/tv3.glb", position: [-2, 0, -0.25], rotation: [0, Math.PI / 2, 0], scale: 1 },
    },
  },
  sofa: {
    name: "sofa",
    fallback: "sofa1",
    select: (s) => s.selectedSofa,
    items: {
      sofa1: { path: "/assets/models/sofa1.glb", position: [-0.9, 0.03, -2.35], rotation: [0, -1.57, 0], scale: 1.3 },
      sofa2: { path: "/assets/models/sofa2.glb", position: [-1, 0.03, -2.35], rotation: [0, -1.57, 0], scale: 1.35 },
    },
  },
};

Object.values(VARIANTS).forEach((v) => useGLTF.preload(v.items[v.fallback].path, true));

export const LAZY_VARIANTS = [
  "/assets/models/bed2.glb",
  "/assets/models/bed3.glb",
  "/assets/models/smallbed2.glb",
  "/assets/models/cupboard2.glb",
  "/assets/models/tv2.glb",
  "/assets/models/tv3.glb",
  "/assets/models/sofa2.glb",
];

function VariantModel({ kind, variant, ...props }) {
  const def = VARIANTS[kind];
  const deferred = useDeferredValue(variant);
  const item = def.items[deferred] || def.items[def.fallback];
  const { scene } = useGLTF(item.path, true);
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) o.name = def.name;
    });
  }, [scene, def.name]);
  return (
    <primitive object={scene} position={item.position} rotation={item.rotation} scale={item.scale} {...props} />
  );
}

export function Furniture({ kind, ...props }) {
  const def = VARIANTS[kind];
  const variant = useFurniture(def.select);
  return (
    <VariantBoundary resetKey={variant} fallback={<VariantModel kind={kind} variant={def.fallback} {...props} />}>
      <VariantModel kind={kind} variant={variant} {...props} />
    </VariantBoundary>
  );
}

const COMMODE = "/assets/models/commode1.glb";
const COUNTERTOP = "/assets/models/countertop.glb";
const MIRROR = "/assets/models/mirror-512.glb";
useGLTF.preload(COMMODE, true);
useGLTF.preload(COUNTERTOP, true);
useGLTF.preload("/assets/models/fridge.glb", true);
useGLTF.preload(MIRROR, true);

export function Commode(props) {
  const { scene } = useGLTF(COMMODE, true);
  return <primitive object={scene} position={[-2, 0, 3.1]} rotation={[0, 0, 0]} scale={1} {...props} />;
}

export function Countertop(props) {
  const { scene } = useGLTF(COUNTERTOP, true);
  const ref = useRef();
  return <primitive ref={ref} object={scene} position={[-3.1, 0, 1.4]} rotation={[0, 1.57, 0]} scale={1.1} {...props} />;
}

export function Mirror(props) {
  const { scene } = useGLTF(MIRROR, true);
  const ref = useRef();
  return <primitive ref={ref} object={scene} position={[-1.4, 0.86, 3.7]} rotation={[0, 1.57, 0]} scale={0.6} {...props} />;
}

export function RoomSensor({ name, position, args, debug = false, color }) {
  const { setCurrentRoom } = useRoom();
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      sensor
      onIntersectionEnter={() => setCurrentRoom(name)}
      onIntersectionExit={() => setCurrentRoom("outside")}
    >
      <CuboidCollider args={args} />
      {debug && (
        <mesh>
          <boxGeometry args={args} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      )}
    </RigidBody>
  );
}

const ROOM_AUDIO = {
  outside: { url: "/assets/audio/lofi.mp3", volume: 0.25 },
  "living-room": { url: "/assets/audio/livingRoom-tone.mp3", volume: 1 },
  "bedroom-1": { url: "/assets/audio/bedroom-tone.mp3", volume: 1 },
  "bedroom-2": { url: "/assets/audio/bedroom-tone.mp3", volume: 1 },
  "kitchen&uility": { url: "/assets/audio/kitchen-tone.mp3", volume: 0.4 },
  balcony: { url: "/assets/audio/balcony-tone.mp3", volume: 0.3 },
};

export function RoomAudio() {
  const { currentRoom } = useRoom();
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const track = ROOM_AUDIO[currentRoom || "outside"];
    if (track) {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.volume = track.volume;
      audio.play().catch((e) => console.log("Playback blocked:", e));
      audioRef.current = audio;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [currentRoom]);
  return null;
}
