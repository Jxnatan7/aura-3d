import { useModelStore } from "@/src/stores/modelStore";
import { createContext, useContext, useMemo } from "react";

const ModelContext = createContext<null | any>(null);

export const ModelContextProvider = ({ children }: any) => {
  const data = useModelStore();
  const value = useMemo(
    () => ({
      modelId: data?.modelId,
      modelName: data?.modelName,
      modelStatus: data?.modelStatus,
      isCompleted: data?.isCompleted,
      isGenerating: data?.isGenerating,
    }),
    [data],
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error(
      "useModelContext must be used within a ModelContextProvider",
    );
  }
  return context;
};

export default ModelContext;
