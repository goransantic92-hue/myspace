"use client";

import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import Door, { DOORS } from "./Door";

const MODEL = "/assets/models/apartment.glb";

export default function ApartmentModel(props) {
  const { nodes, materials } = useGLTF(MODEL);
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group position={[53.306, 0, 191.315]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Door_Door_0.geometry} material={materials.Door} />
          <Door config={DOORS[0]} panelGeometry={nodes.Panel_Door_0.geometry} handleGeometry={nodes.Handle_Handle_0.geometry} doorMat={materials.Door} handleMat={materials.Handle} panelPos={[-0.405, -0.027, 0]} handlePos={[0.74, 0, 1.003]} />
        </group>
        <group position={[-92.175, 0, 152.575]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Door002_Door_0.geometry} material={materials.Door} />
          <Door config={DOORS[1]} panelGeometry={nodes.Panel001_Door_0.geometry} handleGeometry={nodes.Handle001_Handle_0.geometry} doorMat={materials.Door} handleMat={materials.Handle} panelPos={[-0.405, 0.023, 0]} handlePos={[0.74, 0, 1.003]} />
        </group>
        <group position={[-92.175, 0, 312.153]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Door003_Door_0.geometry} material={materials.Door} />
          <Door config={DOORS[2]} panelGeometry={nodes.Panel002_Door_0.geometry} handleGeometry={nodes.Handle002_Handle_0.geometry} doorMat={materials.Door} handleMat={materials.Handle} panelPos={[-0.405, 0.023, 0]} handlePos={[0.74, 0, 1.003]} />
        </group>
        <group position={[53.306, 0, 337.3]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Door004_Door_0.geometry} material={materials.Door} />
          <Door config={DOORS[3]} panelGeometry={nodes.Panel003_Door_0.geometry} handleGeometry={nodes.Handle003_Handle_0.geometry} doorMat={materials.Door} handleMat={materials.Handle} panelPos={[-0.405, -0.027, 0]} handlePos={[0.74, 0, 1.003]} />
        </group>
        <group position={[360.475, 0, -118.485]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Door005_Door_0.geometry} material={materials.Door} />
          <Door config={DOORS[4]} panelGeometry={nodes.Panel004_Door_0.geometry} handleGeometry={nodes.Handle004_Handle_0.geometry} doorMat={materials.Door} handleMat={materials.Handle} panelPos={[-0.405, -0.007, 0]} handlePos={[0.74, 0, 1.003]} />
        </group>
        <group position={[-314.86, 0, 471.79]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh castShadow receiveShadow geometry={nodes.Door006_Door_0.geometry} material={materials.Door} />
          <Door config={DOORS[5]} panelGeometry={nodes.Panel006_Door_0.geometry} handleGeometry={nodes.Handle009_Handle_0.geometry} doorMat={materials.Door} handleMat={materials.Handle} panelPos={[-0.405, -0.057, 0]} handlePos={[0.74, 0, 1.003]} />
        </group>
        <RigidBody type="fixed" colliders="trimesh">
          <group position={[-69.747, -0.001, -294.1]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
            <mesh castShadow receiveShadow geometry={nodes.Window_Window_0.geometry} material={materials.Window} />
            <group position={[0.63, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel003_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel003_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
            <group position={[-0.63, -0.007, 1]} rotation={[-0.087, 0, 0]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel_Window_glass_0.geometry} material={materials.Window_glass} />
              <mesh castShadow receiveShadow geometry={nodes.Handle006_Handle_0.geometry} material={materials.Handle} position={[0.606, 0, 0.72]} />
            </group>
          </group>
          <group position={[188.046, -0.001, -294.1]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
            <mesh castShadow receiveShadow geometry={nodes.Window001_Window_0.geometry} material={materials.Window} />
            <group position={[0.63, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel001_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel001_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
            <group position={[-0.63, -0.007, 1]} rotation={[-0.087, 0, 0]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel002_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel002_Window_glass_0.geometry} material={materials.Window_glass} />
              <mesh castShadow receiveShadow geometry={nodes.Handle005_Handle_0.geometry} material={materials.Handle} position={[0.606, 0, 0.72]} />
            </group>
          </group>
          <group position={[485.707, -0.001, 138.833]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
            <mesh castShadow receiveShadow geometry={nodes.Window002_Window_0.geometry} material={materials.Window} />
            <group position={[0.63, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel004_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel004_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
            <group position={[-0.63, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel005_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel005_Window_glass_0.geometry} material={materials.Window_glass} />
              <mesh castShadow receiveShadow geometry={nodes.Handle007_Handle_0.geometry} material={materials.Handle} position={[0.606, 0, 0.72]} />
            </group>
          </group>
          <group position={[485.707, -0.001, 427.02]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
            <mesh castShadow receiveShadow geometry={nodes.Window003_Window_0.geometry} material={materials.Window} />
            <group position={[0.63, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel006_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel006_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
            <group position={[-0.63, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel007_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel007_Window_glass_0.geometry} material={materials.Window_glass} />
              <mesh castShadow receiveShadow geometry={nodes.Handle008_Handle_0.geometry} material={materials.Handle} position={[0.606, 0, 0.72]} />
            </group>
          </group>
          <group position={[509.313, -95.23, -163.45]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
            <mesh castShadow receiveShadow geometry={nodes.Window004_Window_0.geometry} material={materials.Window} />
            <group position={[-1.286, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel010_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel010_Window_glass_0.geometry} material={materials.Window_glass} />
              <mesh castShadow receiveShadow geometry={nodes.Handle010_Handle_0.geometry} material={materials.Handle} position={[0.619, 0, 1.67]} />
              <mesh castShadow receiveShadow geometry={nodes.Handle012_Handle_0.geometry} material={materials.Handle} position={[1.259, 0, 1.67]} />
              <mesh castShadow receiveShadow geometry={nodes.Handle013_Handle_0.geometry} material={materials.Handle} position={[1.899, 0, 1.67]} />
            </group>
            <group position={[-0.643, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel011_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel011_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
            <group position={[0.643, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel012_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel012_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
            <group position={[1.285, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel013_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel013_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
          </group>
          <group position={[441.048, -95.23, -288.252]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
            <mesh castShadow receiveShadow geometry={nodes.Window005_Window_0.geometry} material={materials.Window} />
            <group position={[-0.666, -0.007, 1]}>
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel015_Window_0.geometry} material={materials.Window} />
              <mesh castShadow receiveShadow geometry={nodes.Window_Panel015_Window_glass_0.geometry} material={materials.Window_glass} />
            </group>
          </group>
        </RigidBody>
        <mesh castShadow receiveShadow geometry={nodes.Door001_Door_0.geometry} material={materials.Door} position={[-16.246, 0, 6.771]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
