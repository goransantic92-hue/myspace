"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DoorContext = createContext(null);
const RoomContext = createContext(null);

export function DoorProvider({ children }) {
  const [openDoors, setOpenDoors] = useState({});
  const setDoorOpen = useCallback((id, open) => {
    setOpenDoors((prev) => (prev[id] === open ? prev : { ...prev, [id]: open }));
  }, []);
  const value = useMemo(() => ({ openDoors, setDoorOpen }), [openDoors, setDoorOpen]);
  return <DoorContext.Provider value={value}>{children}</DoorContext.Provider>;
}

export function useDoors() {
  const ctx = useContext(DoorContext);
  if (!ctx) throw Error("Wrap your scene in <DoorProvider>");
  return ctx;
}

export function RoomProvider({ children }) {
  const [currentRoom, setCurrentRoom] = useState("outside");
  const value = useMemo(() => ({ currentRoom, setCurrentRoom }), [currentRoom]);
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  return useContext(RoomContext);
}
