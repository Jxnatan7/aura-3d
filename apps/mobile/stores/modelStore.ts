import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generalStorage } from "./store";
import { ModelUrls } from "@/services/Model3DService";

type ModelState = {
  modelName: string | null;
  modelId: string | null;
  modelStatus: string | null;
  isCompleted: boolean;
  isGenerating: boolean;
  modelUrls: ModelUrls | null;
  progress: number | null;
  error: string | null;
  clearAppData: () => void;
  setModelId: (modelId: string) => void;
  setModelName: (modelName: string) => void;
  setModelStatus: (modelStatus: string) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setModelUrls: (modelUrls: ModelUrls) => void;
  setProgress: (progress: number) => void;
  updateModelStatus: (data: any) => void;
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
      modelUrls: null,
      modelStatus: null,
      isCompleted: false,
      isGenerating: false,
      progress: null,
      error: null,
      setModelId: (modelId) => set({ modelId }),
      setModelName: (modelName) => set({ modelName }),
      setIsCompleted: (isCompleted) => set({ isCompleted }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setModelStatus: (modelStatus) => set({ modelStatus }),
      setModelUrls: (modelUrls) => set({ modelUrls }),
      setProgress: (progress) => set({ progress }),
      updateModelStatus: (data) => {
        set({
          modelStatus: data.status,
          isCompleted: data.status === "SUCCEEDED",
          isGenerating: data.status === "IN_PROGRESS",
          progress: data.progress,
          modelUrls: data.model_urls,
        });
      },
      setError: (error) => set({ error }),
      clearAppData: () => set({ ...get(), ...INITIAL_STATE }),
    }),
    {
      name: "model-storage",
      storage: createJSONStorage(() => generalStorage),
    },
  ),
);
