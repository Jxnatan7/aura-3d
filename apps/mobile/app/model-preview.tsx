import React, { useEffect } from "react";
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
import Button from "@/components/theme/Button";
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
  const {
    modelId,
    modelName,
    isCompleted,
    isGenerating,
    progress,
    clearAppData,
    modelUrls,
  } = useModelStore();

  useModelSSE(modelId);

  useEffect(() => {
    if (isCompleted && modelUrls?.glb) {
      const timer = setTimeout(() => {
        router.push({
          pathname: "/model-view",
          params: {
            id: modelId,
            glb: modelUrls.glb,
            name: modelName,
          },
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        clearAppData();
      };
    }
  }, [isCompleted, modelUrls, modelId, modelName, router]);

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
          backgroundColor={isGenerating ? "pending" : "success"}
          paddingHorizontal="m"
          paddingVertical="s"
          borderRadius={20}
          mb="xl"
        >
          <Feather
            name={isGenerating ? "loader" : "check-circle"}
            size={16}
            color={isGenerating ? "#FFC107" : "#2ECC71"}
          />
          <Text
            ml="s"
            fontWeight="bold"
            color={isGenerating ? "pending" : "success"}
            style={{ color: isGenerating ? "#FFC107" : "#2ECC71" }}
          >
            {isGenerating ? "IA Trabalhando..." : "Concluído"}
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
            {modelName || "Sem nome"}
          </Text>
          <Text variant="body" color="gray400" fontSize={12}>
            ID: {modelId}
          </Text>
        </Box>
      </Box>

      <Box pb="xl" px="m">
        <Button
          variant="transparent"
          text="Cancelar / Limpar"
          onPress={clearAppData}
          style={{ borderColor: "#FF5252" }}
          textProps={{ color: "red" }}
        />
      </Box>
    </Container>
  );
}
