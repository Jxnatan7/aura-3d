import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generalStorage } from "./store";

type ModelState = {
  modelName: string | null;
  modelId: string | null;
  isCompleted: boolean;
  isGenerating: boolean;
  error: string | null;
  clearAppData: () => void;
  setModelId: (modelId: string) => void;
  setModelName: (modelName: string) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string) => void;
};

const INITIAL_STATE: Partial<ModelState> = {
  isGenerating: false,
};

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      modelName: null,
      modelId: null,
      isCompleted: false,
      isGenerating: false,
      error: null,
      setModelId: (modelId) => set({ modelId }),
      setModelName: (modelName) => set({ modelName }),
      setIsCompleted: (isCompleted) => set({ isCompleted }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      clearAppData: () => set({ ...get(), ...INITIAL_STATE }),
    }),
    {
      name: "model-storage",
      storage: createJSONStorage(() => generalStorage),
    },
  ),
);
