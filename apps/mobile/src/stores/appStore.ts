import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generalStorage } from "./store";
import UserService from "@/src/services/UserService";
import { useAuthStore } from "./authStore";

type AppState = {
  theme: "light" | "dark";
  isLoading: boolean;
  error: string | null;

  setupUser: (payload: any) => Promise<void>;
  setTheme: (theme: "light" | "dark") => void;
  clearAppData: () => void;
};

const INITIAL_STATE: Partial<AppState> = {
  isLoading: false,
  error: null,
  theme: "light",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      isLoading: false,
      error: null,
      setupUser: async (payload) => {
        set({ isLoading: true, error: null });
        const { user } = useAuthStore.getState();

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        try {
          const data = await UserService.update(user.id, payload);

          if (!data) {
            set({
              isLoading: false,
            });
            return;
          }

          useAuthStore.setState({
            user: data,
          });

          set({
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Falha no cadastro",
            isLoading: false,
          });
          throw error;
        }
      },
      setTheme: (theme) => set({ theme }),
      clearAppData: () => set({ ...get(), ...INITIAL_STATE }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => generalStorage),
    },
  ),
);
