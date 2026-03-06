import { useEffect, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useModelStore } from "@/stores/modelStore";
import { useModelSSE } from "@/hooks/useModelSSE";
import { useFakeProgress } from "@/hooks/useFakeProgress";

export function useModelPreviewLogic() {
  const router = useRouter();
  const { modelId, clearAppData } = useModelStore();
  const { name: paramName, id: paramId } = useLocalSearchParams<{
    name: string;
    id: string;
  }>();

  const data = useModelSSE(paramId || modelId);

  const { isGenerating, status, progress, modelUrls, name, id } =
    useMemo(() => {
      if (!data?.data) return {};
      return {
        isGenerating: data?.data.status === "IN_PROGRESS",
        status: data?.data.status,
        progress: data?.data.progress,
        modelUrls: data?.data.modelUrls,
        name: data?.data.name,
        id: data?.data.id,
      };
    }, [data]);

  const displayProgress = useFakeProgress(progress);

  const isCompleted = useMemo(
    () => (progress && progress >= 100) || status === "SUCCEEDED",
    [progress, status],
  );

  const isLoading = useMemo(
    () => (isGenerating && !isCompleted) || !status,
    [isGenerating, isCompleted, status],
  );

  useEffect(() => {
    if (isCompleted && modelUrls?.glb) {
      const navigationTimeout = setTimeout(() => {
        router.replace({
          pathname: "/model-view",
          params: {
            id: modelId,
            glb: modelUrls.glb,
            name: name || paramName,
          },
        });

        clearAppData();
      }, 800);

      return () => clearTimeout(navigationTimeout);
    }
  }, [
    isCompleted,
    modelUrls?.glb,
    modelId,
    name,
    paramName,
    router,
    clearAppData,
  ]);

  const goBack = () => router.push("/(tabs)");

  return {
    isLoading,
    displayProgress,
    displayName: name || paramName || "Processando nome...",
    displayId: id || modelId,
    goBack,
  };
}
