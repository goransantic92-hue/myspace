"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFurniture, useInteraction } from "./stores";

const WALL_COLORS = [
  { name: "Clean White", hex: "#F5F5F0" },
  { name: "Warm Cream", hex: "#F2EBD9" },
  { name: "Soft Beige", hex: "#D8CFC4" },
  { name: "Olive Green", hex: "#7D8C5A" },
  { name: "Dusty Blue", hex: "#6B8CAE" },
];

const FLOOR_COLORS = [
  { name: "Light Timber", hex: "#DFCDB5" },
  { name: "Natural Birch", hex: "#EADBC8" },
  { name: "Terracotta", hex: "#C8A896" },
  { name: "Muted Oak", hex: "#B8A890" },
  { name: "Deep Slate", hex: "#3A4F60" },
];

const pill =
  "rounded-full border border-[#2A2725]/15 bg-[#EDE6D6]/90 text-[#2A2725] shadow-lg backdrop-blur-md";
const pillText = "text-[11px] uppercase tracking-[0.18em] md:text-xs";

function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-[#2A2725]/30 px-1 font-sans text-[10px] font-semibold leading-none">
      {children}
    </kbd>
  );
}

function StyleOptions({ label, options, value, onChange }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        <span className="h-[2px] w-3 rounded-full bg-amber-400" />
        {label}
      </h3>
      <div className="flex gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150 ${active ? "border-amber-400 bg-amber-50 text-amber-700 shadow-[0_2px_10px_-2px_rgba(245,158,11,0.45)]" : "border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm"}`}
            >
              {option.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CustomizationPanel({ activeTarget = "" }) {
  const { setWallColor, wallColor, setFloorColor, floorColor, activeTab, setActiveTab } = useInteraction();
  const setSelectedBed = useFurniture((s) => s.setSelectedBed);
  const selectedBed = useFurniture((s) => s.selectedBed);
  const setSelectedCupboard = useFurniture((s) => s.setSelectedCupboard);
  const selectedCupboard = useFurniture((s) => s.selectedCupboard);
  const setSelectedTv = useFurniture((s) => s.setSelectedTv);
  const selectedTv = useFurniture((s) => s.selectedTv);
  const setSelectedSmallBed = useFurniture((s) => s.setSelectedSmallBed);
  const selectedSmallBed = useFurniture((s) => s.selectedSmallBed);
  const setSelectedSofa = useFurniture((s) => s.setSelectedSofa);
  const selectedSofa = useFurniture((s) => s.selectedSofa);

  const target = (activeTarget || "").toLowerCase();
  const locked =
    target.includes("walls") && !target.includes("floor")
      ? "walls"
      : target.includes("floor") && !target.includes("walls")
        ? "floor"
        : null;
  const showWalls = locked ? locked === "walls" : activeTab === "walls";
  const swatches = showWalls ? WALL_COLORS : FLOOR_COLORS;
  const current = showWalls ? wallColor : floorColor;
  const setColor = showWalls ? setWallColor : setFloorColor;

  const isSurface = target.includes("walls") || target.includes("floor");
  const isBed = target.includes("bed") && !target.includes("smallbed");
  const isSmallBed = target.includes("smallbed");
  const isCupboard = target.includes("cupboard");
  const isTv = target.includes("tv");
  const isSofa = target.includes("sofa");

  return (
    <div className="flex w-full min-w-xs flex-col justify-center items-center rounded-2xl border border-gray-200 bg-white p-5 pt-3 shadow-[0_-8px_40px_-10px_rgba(0,0,0,0.15)]">
      <div className="mb-2">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">Customization</h2>
      </div>
      {isSurface && (
        <>
          {!locked && (
            <div className="mb-4 flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1">
              {[
                { key: "walls", label: "Walls" },
                { key: "floor", label: "Floor" },
              ].map((tab) => {
                const active = tab.key === "walls" ? showWalls : !showWalls;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold tracking-wide transition-all duration-150 ${active ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex items-center gap-4">
            {swatches.map((swatch) => {
              const active = current === swatch.hex;
              return (
                <button
                  key={swatch.name}
                  onClick={() => setColor(swatch.hex)}
                  className="group flex shrink-0 flex-col items-center gap-2"
                >
                  <span
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-150 ease-out ${active ? "scale-100" : "group-hover:scale-110"}`}
                  >
                    <span
                      className={`absolute inset-[-4px] rounded-full border-2 transition-all duration-150 ${active ? "border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]" : "border-transparent group-hover:border-gray-300"}`}
                    />
                    <span
                      className="h-full w-full rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  </span>
                  <span
                    className={`max-w-[4.5rem] truncate text-center text-[10px] font-medium tracking-wide transition-colors ${active ? "text-amber-700" : "text-gray-400 group-hover:text-gray-700"}`}
                  >
                    {swatch.name}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
      {isBed && (
        <StyleOptions label="Bed Style" options={["bed1", "bed2", "bed3"]} value={selectedBed} onChange={setSelectedBed} />
      )}
      {isSmallBed && (
        <StyleOptions
          label="Small Bed Style"
          options={["smallbed1", "smallbed2"]}
          value={selectedSmallBed}
          onChange={setSelectedSmallBed}
        />
      )}
      {isCupboard && (
        <StyleOptions
          label="Cupboard Style"
          options={["cupboard1", "cupboard2"]}
          value={selectedCupboard}
          onChange={setSelectedCupboard}
        />
      )}
      {isTv && (
        <StyleOptions label="TV Unit Style" options={["tv1", "tv2", "tv3"]} value={selectedTv} onChange={setSelectedTv} />
      )}
      {isSofa && (
        <StyleOptions label="Sofa Style" options={["sofa1", "sofa2"]} value={selectedSofa} onChange={setSelectedSofa} />
      )}
      <div className="mt-2 flex items-center justify-center gap-2 border-t border-gray-100 pt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-300">
        <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
        Walk away to close
      </div>
    </div>
  );
}

function Crosshair() {
  const active = useInteraction((s) => s.isHintVisible);
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      <div
        className={`w-1.5 h-1.5 bg-white rounded-full transition-transform duration-300 ease-out mix-blend-difference ${active ? "scale-[2.5] opacity-100" : "scale-100 opacity-60"}`}
        style={{ boxShadow: "0 0 4px rgba(0,0,0,0.3)" }}
      />
    </div>
  );
}

function Joystick() {
  const setJoystick = useInteraction((s) => s.setMobileJoystick);
  const [touchId, setTouchId] = useState(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const baseRef = useRef(null);

  const start = (e) => {
    e.stopPropagation();
    if (touchId === null) setTouchId(e.changedTouches[0].identifier);
  };
  const move = (e) => {
    e.stopPropagation();
    if (touchId === null || !baseRef.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === touchId) {
        const rect = baseRef.current.getBoundingClientRect();
        let dx = t.clientX - (rect.left + rect.width / 2);
        let dy = t.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 45) {
          dx = (dx / dist) * 45;
          dy = (dy / dist) * 45;
        }
        setKnob({ x: dx, y: dy });
        setJoystick({ x: dx / 45, y: dy / 45 });
        break;
      }
    }
  };
  const end = (e) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        setTouchId(null);
        setKnob({ x: 0, y: 0 });
        setJoystick({ x: 0, y: 0 });
        break;
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-end justify-start p-6 select-none">
      <div
        ref={baseRef}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        onTouchCancel={end}
        className="pointer-events-auto relative w-32 h-32 bg-black/40 backdrop-blur-md rounded-full border-2 border-white/40 flex items-center justify-center touch-none shadow-2xl"
      >
        <div
          className="nipple absolute w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full border border-white shadow-lg transition-transform duration-75"
          style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        />
      </div>
    </div>
  );
}

export default function TourHud() {
  const { isHintVisible, isPanelOpen, activeInteraction, openPanel } = useInteraction();
  const [showLockHint, setShowLockHint] = useState(false);
  const [locked, setLocked] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    setShowLockHint(!touch);
    const onChange = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    onChange();
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  const isSurface = activeInteraction?.includes("walls") || activeInteraction?.includes("floor");
  const isFurniture =
    activeInteraction?.includes("bed") ||
    activeInteraction?.includes("cupboard") ||
    activeInteraction?.includes("tv") ||
    activeInteraction?.includes("commode") ||
    activeInteraction?.includes("sofa");
  const isDoor = activeInteraction?.startsWith("door");
  const isClose = activeInteraction?.includes("close");
  const customizable = isSurface || isFurniture;
  const hintOn = isHintVisible && !isPanelOpen;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      <Crosshair />
      <Link
        href="/"
        prefetch={false}
        className={`group pointer-events-auto absolute flex items-center gap-2.5 px-4 py-2.5 font-sans transition-colors duration-300 hover:bg-[#2A2725] hover:text-[#EDE6D6] ${pill} ${pillText} ${isTouch ? "hidden" : "left-6 bottom-6 md:left-10 md:bottom-8"}`}
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
        <span>Back to site</span>
      </Link>
      {showLockHint && !isPanelOpen && (
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <div className={`flex items-center gap-2 px-4 py-2.5 font-sans ${pill} ${pillText}`}>
            {locked ? (
              <>
                Press <Kbd>Esc</Kbd> to unlock cursor
              </>
            ) : (
              "Click to look around"
            )}
          </div>
        </div>
      )}
      {isTouch && <Joystick />}
      {!isTouch && hintOn && customizable && (
        <div className="absolute top-1/2 left-1/2 mt-10 -translate-x-1/2 pointer-events-auto">
          <div className={`flex items-center gap-2 px-4 py-2.5 font-sans ${pill} ${pillText}`}>
            Click or press <Kbd>Q</Kbd> to customize
          </div>
        </div>
      )}
      {isTouch && hintOn && customizable && (
        <div className="absolute right-6 bottom-10 pointer-events-auto">
          <button
            onClick={() => {
              openPanel(activeInteraction);
              if (document.pointerLockElement) document.exitPointerLock();
            }}
            className={`touch-none px-5 py-3 font-sans active:scale-95 transition-transform ${pill} ${pillText}`}
          >
            Customize
          </button>
        </div>
      )}
      {hintOn && isDoor && (
        <div className="absolute top-1/2 left-1/2 mt-10 -translate-x-1/2 pointer-event-none select-none">
          <div className={`flex items-center gap-2 px-4 py-2.5 font-sans ${pill} ${pillText}`}>
            {isTouch ? (
              <>Tap on gate to {isClose ? "close" : "open"}</>
            ) : (
              <>
                Press <Kbd>E</Kbd> to {isClose ? "close" : "open"}
              </>
            )}
          </div>
        </div>
      )}
      {isPanelOpen && (
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 pointer-events-auto z-50">
          <CustomizationPanel activeTarget={activeInteraction} variant="bottom" />
        </div>
      )}
    </div>
  );
}
