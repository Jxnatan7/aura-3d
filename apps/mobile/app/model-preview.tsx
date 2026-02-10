import React, { useEffect, useMemo } from "react";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";

import { Text, Box } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import { useModelStore } from "@/stores/modelStore";
import { useModelSSE } from "@/hooks/useModelSSE";
import { ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";

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

  const { data } = useModelSSE(modelId);

  const { id, name, status, isCompleted, isGenerating, progress, modelUrls } =
    data;

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
  }, [isCompleted, modelUrls, modelId, name, router]);

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        title: "Gerando Modelo",
        titleProps: { textAlign: "center" },
      }}
    >
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

        <ProgressRing progress={progress || 0} />

        <Box width="100%" alignItems="center" gap="s">
          <Text
            variant="subHeader"
            fontWeight="bold"
            color="white"
            fontSize={22}
          >
            {name || "Sem nome"}
          </Text>
          <Text variant="body" color="gray400" fontSize={12}>
            ID: {id}
          </Text>
        </Box>
      </Box>
    </Container>
  );
}
