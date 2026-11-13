"use client";

import { Environment } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import ApartmentModel from "./ApartmentModel";
import Player from "./Player";
import { DoorProvider, RoomProvider } from "./SceneContext";
import {
  Commode,
  Countertop,
  Furniture,
  Ground,
  Mirror,
  RoomAudio,
  RoomSensor,
  WallsAndFloor,
  Yard,
} from "./SceneParts";

const SKY = [
  "/assets/textures/sky/px.png",
  "/assets/textures/sky/nx.png",
  "/assets/textures/sky/py.png",
  "/assets/textures/sky/ny.png",
  "/assets/textures/sky/pz.png",
  "/assets/textures/sky/nz.png",
];

export default function TourScene() {
  return (
    <DoorProvider>
      <RoomProvider>
        <RoomAudio />
        <ambientLight intensity={1.2} />
        <fogExp2 attach="fog" args={["#bcb9b3", 0.09]} />
        <Environment files={SKY} background />
        <directionalLight
          position={[50, 50, 25]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <RoomSensor name="living-room" position={[0.3, 0, -1.6]} args={[3, 1, 2]} color="lightblue" />
        <RoomSensor name="balcony" position={[4.4, 0, -1.6]} args={[0.5, 1, 1.5]} color="lightpink" />
        <RoomSensor name="bedroom-1" position={[2.9, 0, 1.5]} args={[2, 1, 1]} color="lightgreen" />
        <RoomSensor name="bedroom-2" position={[2.9, 0, 4.2]} args={[2, 1, 1]} color="lightred" />
        <RoomSensor name="kitchen&uility" position={[-1.8, 0, 2]} args={[0.5, 1, 1.5]} color="lightyellow" />
        <Ground />
        <Yard />
        <RigidBody type="fixed" colliders={false} position={[1, 2.8, 1.3]}>
          <CuboidCollider args={[20, 0.05, 20]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[9, 0.1, 9.5]} />
            <meshStandardMaterial color="#fcfcfc" roughness={0.9} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" colliders="trimesh">
          <Furniture kind="bed" />
          <Furniture kind="smallbed" />
          <Furniture kind="cupboard" />
          <Furniture kind="tv" />
          <Commode />
          <Furniture kind="sofa" />
          <Countertop />
          <WallsAndFloor />
        </RigidBody>
        <ApartmentModel />
        <Mirror />
        <Player />
      </RoomProvider>
    </DoorProvider>
  );
}
