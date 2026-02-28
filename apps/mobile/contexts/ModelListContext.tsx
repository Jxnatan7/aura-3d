import React, { createContext, useContext, useState } from "react";
import { Model3D } from "@/services/Model3DService";

interface ModelListContextData {
  models: Model3D[];
  setModels: (models: Model3D[]) => void;
}

export const ModelListContext = createContext<ModelListContextData>(
  {} as ModelListContextData,
);

export const ModelListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [models, setModels] = useState<Model3D[]>([]);

  return (
    <ModelListContext.Provider value={{ models, setModels }}>
      {children}
    </ModelListContext.Provider>
  );
};

export const useModelListContext = () => useContext(ModelListContext);
