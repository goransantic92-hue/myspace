"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import TourScene from "./TourScene";
import TourHud from "./TourHud";
import TourLoader, { ReadySignal, TourErrorBoundary } from "./TourLoader";
import { LAZY_VARIANTS } from "./SceneParts";

const prefetched = new Set();

function Tour() {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    const conn = navigator.connection;
    if (conn?.saveData || ["slow-2g", "2g"].includes(conn?.effectiveType)) return () => {};
    const queue = LAZY_VARIANTS.filter((p) => !prefetched.has(p));
    let timer;
    const next = () => {
      const path = queue.shift();
      if (!path) return;
      prefetched.add(path);
      useGLTF.preload(path, true);
      timer = setTimeout(next, 1500);
    };
    timer = setTimeout(next, 1500);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <div className="w-screen h-screen flex">
      <TourLoader ready={ready} />
      <TourHud />
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, -1, 15], fov: 70 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <TourScene />
            <ReadySignal onReady={markReady} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function TourExperience() {
  return (
    <TourErrorBoundary>
      <Tour />
    </TourErrorBoundary>
  );
}
