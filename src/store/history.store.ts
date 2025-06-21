import { create } from "zustand";
import { History } from "@/types/window";

interface HistoryStore {
  history: History[]
  setHistory: (history: History[]) => void
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  setHistory: (history: History[]) => set({ history }),
}))
