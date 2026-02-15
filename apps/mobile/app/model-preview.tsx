import React, { useEffect, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Text, Box } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import { useModelStore } from "@/stores/modelStore";
import { useModelSSE } from "@/hooks/useModelSSE";
import { useFakeProgress } from "@/hooks/useFakeProgress";
import ProgressRing from "@/components/theme/ProgressRing";

export default function ModelPreview() {
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
        id: data?.data._id,
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

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        // hideBackButton: true,
        backButtonFallback: () => router.push("/(tabs)"),
      }}
    >
      <Text
        variant="containerHeader"
        mt="xxxl"
        mb="xxxl"
        fontSize={20}
        textAlign="center"
      >
        Gerando Modelo
      </Text>

      <Box flex={1} alignItems="center" justifyContent="center" px="m">
        <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor={isLoading ? "blue300" : "success"}
          paddingHorizontal="m"
          paddingVertical="s"
          borderRadius={20}
          mb="xl"
          gap="s"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Feather name="check" size={20} color="#FFF" />
          )}

          <Text fontWeight="bold" color="white">
            {isLoading ? "IA Trabalhando..." : "Concluído"}
          </Text>
        </Box>

        <ProgressRing progress={displayProgress} />

        <Box width="100%" alignItems="center" gap="xs">
          <Text
            variant="subHeader"
            fontWeight="bold"
            color="mainText"
            fontSize={22}
          >
            {name || paramName || "Processando nome..."}
          </Text>
          <Text variant="body" color="gray600" fontSize={12}>
            ID: {id || modelId}
          </Text>
        </Box>
      </Box>
    </Container>
  );
}
