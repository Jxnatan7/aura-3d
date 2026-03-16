import React, { useEffect, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useModelStore } from "@/src/stores/modelStore";
import { useModelSSE } from "@/src/hooks/useModelSSE";
import { useFakeProgress } from "@/src/hooks/useFakeProgress";
import ProgressBar from "@/src/components/theme/ProgressBar";

export function ProgressController() {
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

  return <ProgressBar progress={displayProgress} />;
}
