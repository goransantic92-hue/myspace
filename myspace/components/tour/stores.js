import { create } from "zustand";

export const useInteraction = create((set) => ({
  isHintVisible: false,
  isPanelOpen: false,
  activeInteraction: null,
  activeTab: "walls",
  wallColor: "#F5F5F0",
  floorColor: "#DFCDB5",
  mobileJoystick: { x: 0, y: 0 },
  setMobileJoystick: (mobileJoystick) => set({ mobileJoystick }),
  showHint: (activeInteraction) => set({ isHintVisible: true, activeInteraction }),
  hideHint: () => set({ isHintVisible: false, activeInteraction: null }),
  openPanel: (activeTab = "walls") => set({ isPanelOpen: true, isHintVisible: false, activeTab }),
  closePanel: () => set({ isPanelOpen: false }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setWallColor: (wallColor) => set({ wallColor }),
  setFloorColor: (floorColor) => set({ floorColor }),
}));

export const useFurniture = create((set) => ({
  selectedBed: "bed1",
  setSelectedBed: (selectedBed) => set({ selectedBed }),
  selectedSmallBed: "smallbed1",
  setSelectedSmallBed: (selectedSmallBed) => set({ selectedSmallBed }),
  selectedTv: "tv1",
  setSelectedTv: (selectedTv) => set({ selectedTv }),
  selectedCupboard: "cupboard1",
  setSelectedCupboard: (selectedCupboard) => set({ selectedCupboard }),
  selectedSofa: "sofa1",
  setSelectedSofa: (selectedSofa) => set({ selectedSofa }),
}));

export const INTERACTABLE = ["walls", "floor", "bed", "cupboard", "tv", "commode", "sofa"];
export const isInteractable = (name) => INTERACTABLE.some((key) => name.includes(key));
