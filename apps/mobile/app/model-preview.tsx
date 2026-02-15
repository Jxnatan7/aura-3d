import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { Text, Box } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import { useModelStore } from "@/stores/modelStore";
import { useModelSSE } from "@/hooks/useModelSSE";

const { width } = Dimensions.get("window");
const CIRCLE_LENGTH = 800;
const R = CIRCLE_LENGTH / (2 * Math.PI);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({ progress }: { progress: number }) => {
  const strokeOffset = useDerivedValue(() => {
    return withTiming(CIRCLE_LENGTH - (CIRCLE_LENGTH * progress) / 100, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  });

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset.value,
  }));

  return (
    <Box alignItems="center" justifyContent="center" mb="xl">
      <Svg
        width={width * 0.7}
        height={width * 0.7}
        viewBox={`0 0 ${width} ${width}`}
      >
        <G rotation="-90" origin={`${width / 2}, ${width / 2}`}>
          <Circle
            cx={width / 2}
            cy={width / 2}
            r={R}
            stroke="#333"
            strokeWidth={15}
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            cx={width / 2}
            cy={width / 2}
            r={R}
            stroke="#2ECC71"
            strokeWidth={15}
            strokeDasharray={CIRCLE_LENGTH}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Box position="absolute" alignItems="center">
        <Text variant="header" fontSize={40} fontWeight="bold" color="white">
          {Math.round(progress)}%
        </Text>
        <Text variant="body" color="gray200" fontSize={12} letterSpacing={1}>
          PROCESSANDO
        </Text>
      </Box>
    </Box>
  );
};

export default function ModelPreview() {
  const router = useRouter();
  const { modelId, clearAppData } = useModelStore();
  const { name: modelName } = useLocalSearchParams<{ name: string }>();

  const data: any = useModelSSE(modelId);

  const { id, name, status, isGenerating, progress, modelUrls } = data;

  const isCompleted = useMemo(
    () => progress >= 100 || status === "SUCCEEDED",
    [progress, status],
  );

  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const realProgress = progress || 0;

    setDisplayProgress((prev) => Math.max(prev, realProgress));

    if (realProgress >= 100) return;

    const maxFakeProgress = realProgress >= 50 ? 99 : 49;

    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= maxFakeProgress) return prev;

        const step = Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + step, maxFakeProgress);
      });
    }, 1600);

    return () => clearInterval(timer);
  }, [progress]);

  const isLoading = useMemo(
    () => (isGenerating && !isCompleted) ?? true,
    [isGenerating, isCompleted],
  );

  useEffect(() => {
    if (isCompleted && modelUrls?.glb) {
      const timer = setTimeout(() => {
        router.push({
          pathname: "/model-view",
          params: {
            id: modelId,
            glb: modelUrls.glb,
            name: name,
          },
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        clearAppData();
      };
    }
  }, [isCompleted]);

  return (
    <Container variant="screen">
      <Text variant="containerHeader" mt="xxxl" mb="xxxl" fontSize={20}>
        Gerando Modelo
      </Text>
      <Box flex={1} alignItems="center" justifyContent="center" px="m">
        <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor={isLoading ? "pending" : "success"}
          paddingHorizontal="m"
          paddingVertical="s"
          borderRadius={20}
          mb="xl"
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#FFF"
              style={{ marginLeft: 5, maxWidth: 16 }}
            />
          ) : (
            <Feather
              name="check"
              size={24}
              color="#FFF"
              style={{ marginLeft: 5, maxWidth: 16 }}
            />
          )}

          <Text
            ml="s"
            fontWeight="bold"
            color={isLoading ? "pending" : "success"}
            style={{ color: "#FFF" }}
          >
            {isLoading ? "IA Trabalhando..." : "Concluído"}
          </Text>
        </Box>

        <ProgressRing progress={displayProgress} />

        <Box width="100%" alignItems="center" gap="s">
          <Text
            variant="subHeader"
            fontWeight="bold"
            color="white"
            fontSize={22}
          >
            {name || modelName || "Sem nome"}
          </Text>
          <Text variant="body" color="gray400" fontSize={12}>
            ID: {id || modelId}
          </Text>
        </Box>
      </Box>
    </Container>
  );
}
