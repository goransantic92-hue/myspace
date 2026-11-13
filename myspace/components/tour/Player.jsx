"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { isInteractable, useInteraction } from "./stores";

function onCustomizeKey(e) {
  if (e.key.toLowerCase() !== "q") return;
  const state = useInteraction.getState();
  if (state.isHintVisible && state.activeInteraction) {
    const target = state.activeInteraction;
    if (isInteractable(target)) {
      state.openPanel(target);
      if (document.pointerLockElement) document.exitPointerLock();
    }
  }
}

function InteractionRay() {
  const { camera, scene } = useThree();
  const raycaster = useMemo(() => {
    const r = new THREE.Raycaster();
    r.far = 3;
    return r;
  }, []);
  const center = useMemo(() => new THREE.Vector2(0, 0), []);
  const frame = useRef(0);

  useEffect(() => {
    window.addEventListener("keydown", onCustomizeKey);
    return () => window.removeEventListener("keydown", onCustomizeKey);
  }, []);

  useFrame(() => {
    frame.current += 1;
    if (frame.current % 3 !== 0) return;
    raycaster.setFromCamera(center, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    const state = useInteraction.getState();
    const clear = () => {
      const active = state.activeInteraction;
      if (active && !active.startsWith("door")) state.hideHint();
      if (state.isPanelOpen) state.closePanel();
    };
    if (hits.length === 0) return void clear();
    const hit = hits[0];
    const name = (hit.object.name || "").toLowerCase();
    if (hit.distance < 3 && isInteractable(name)) {
      if (state.isPanelOpen) {
        if (state.activeInteraction !== name) {
          state.closePanel();
          state.hideHint();
        }
      } else if (!(state.isHintVisible && state.activeInteraction === name)) {
        state.showHint(name);
      }
    } else clear();
  });

  return null;
}

export default function Player() {
  const body = useRef();
  const { camera } = useThree();
  const footstep = useRef(null);
  const lastStep = useRef(0);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const dir = useMemo(() => new THREE.Vector3(), []);
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const isTouch = useMemo(
    () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    [],
  );
  const look = useRef({ yaw: 0, pitch: 0 });
  const lookTouch = useRef(null);

  useEffect(() => {
    const audio = new Audio("/assets/audio/footstep.mp3");
    audio.preload = "auto";
    footstep.current = audio;
    return () => {
      audio.pause();
      footstep.current = null;
    };
  }, []);

  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k] = true;
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    let lastX = 0;
    let lastY = 0;
    const touchStart = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (lookTouch.current === null && t.clientX > window.innerWidth / 2) {
          const el = document.elementFromPoint(t.clientX, t.clientY);
          if (el && !el.closest("button") && !el.closest(".nipple")) {
            lookTouch.current = t.identifier;
            lastX = t.clientX;
            lastY = t.clientY;
            break;
          }
        }
      }
    };
    const touchMove = (e) => {
      if (lookTouch.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === lookTouch.current) {
          const dx = t.clientX - lastX;
          const dy = t.clientY - lastY;
          lastX = t.clientX;
          lastY = t.clientY;
          look.current.yaw -= 0.005 * dx;
          look.current.pitch -= 0.005 * dy;
          look.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, look.current.pitch));
          break;
        }
      }
    };
    const touchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouch.current) {
          lookTouch.current = null;
          break;
        }
      }
    };
    if (isTouch) {
      window.addEventListener("touchstart", touchStart, { passive: true });
      window.addEventListener("touchmove", touchMove, { passive: false });
      window.addEventListener("touchend", touchEnd);
      window.addEventListener("touchcancel", touchEnd);
    }
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      if (isTouch) {
        window.removeEventListener("touchstart", touchStart);
        window.removeEventListener("touchmove", touchMove);
        window.removeEventListener("touchend", touchEnd);
        window.removeEventListener("touchcancel", touchEnd);
      }
    };
  }, [isTouch]);

  useFrame((state) => {
    if (!body.current) return;
    const joystick = useInteraction.getState().mobileJoystick;
    const pos = body.current.translation();
    camera.position.set(pos.x, pos.y + 0.6, pos.z);
    if (isTouch) {
      euler.set(look.current.pitch, look.current.yaw, 0, "YXZ");
      camera.quaternion.setFromEuler(euler);
    }
    dir.set(0, 0, 0);
    if (keys.current.w || joystick.y < 0) dir.z -= 1;
    if (keys.current.s || joystick.y > 0) dir.z += 1;
    if (keys.current.a || joystick.x < 0) dir.x -= 1;
    if (keys.current.d || joystick.x > 0) dir.x += 1;
    dir.normalize();
    dir.applyQuaternion(camera.quaternion);
    dir.y = 0;
    dir.normalize();

    const vel = body.current.linvel();
    const moving =
      Math.abs(dir.x) > 0 || Math.abs(dir.z) > 0 || Math.abs(joystick.x) > 0 || Math.abs(joystick.y) > 0;
    body.current.setLinvel({ x: 4 * dir.x, y: vel.y, z: 4 * dir.z }, true);

    const audio = footstep.current;
    if (!audio) return;
    if (moving) {
      if (state.clock.getElapsedTime() - lastStep.current > 0.4) {
        audio.currentTime = 0;
        audio.volume = 0.4;
        audio.play().catch(() => {});
        lastStep.current = state.clock.getElapsedTime();
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  useEffect(() => {
    if (!isTouch) camera.lookAt(60, 0, 15);
  }, [camera, isTouch]);

  return (
    <>
      {!isTouch && <PointerLockControls />}
      <RigidBody ref={body} colliders={false} position={[-10, 2.5, 5]} enabledRotations={[false, false, false]} gravityScale={1}>
        <CapsuleCollider args={[0.5, 0.3]} />
        <mesh>
          <capsuleGeometry args={[0.35, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
      <InteractionRay />
    </>
  );
}
