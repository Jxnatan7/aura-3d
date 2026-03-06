import { useModelListContext } from "@/contexts/ModelListContext";
import { useRouter } from "expo-router";

export const useModelActions = (id: string) => {
  const { replace } = useRouter();
  const { models } = useModelListContext();

  const currentIndex = models?.findIndex((m) => m.id === id);
  const hasNext = currentIndex !== -1 && currentIndex < models?.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      const nextModel = models?.[currentIndex + 1];
      replace({
        pathname: "/model-view",
        params: {
          id: nextModel.id,
          glb: nextModel.modelUrls?.glb,
          name: nextModel.name,
          imageUrl: nextModel.thumbnailUrl ?? nextModel.imageUrl,
        },
      });
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevModel = models?.[currentIndex - 1];
      replace({
        pathname: "/model-view",
        params: {
          id: prevModel.id,
          glb: prevModel.modelUrls?.glb,
          name: prevModel.name,
          imageUrl: prevModel.thumbnailUrl ?? prevModel.imageUrl,
        },
      });
    }
  };

  return {
    handleNext,
    handlePrev,
    hasNext,
    hasPrev,
  };
};
