import React, { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Box, Text } from "@/src/components/restyle";
import LottieView from "lottie-react-native";
import { ProgressController } from "../ProgressController";
import { useModelStore } from "@/src/stores/modelStore";

const LOADING_MESSAGES: Record<number, string> = {
  0: "Lendo imagem...",
  10: "Analisando formas e contornos...",
  20: "Processando geometria...",
  30: "Calculando profundidade...",
  40: "Criando malha 3D...",
  50: "Aplicando texturas base...",
  60: "Refinando materiais...",
  70: "Ajustando iluminação e sombras...",
  80: "Otimizando polígonos...",
  90: "Finalizando detalhes, quase pronto...",
};

const getMessageForProgress = (progress: number) => {
  return LOADING_MESSAGES[progress] || "";
};

export function ModelLoadingAnimation() {
  const fakeProgress = useModelStore((state) => state.fakeProgress);

  const [displayedMessage, setDisplayedMessage] = useState(() =>
    getMessageForProgress(fakeProgress),
  );

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const nextMessage = getMessageForProgress(fakeProgress);

    if (nextMessage !== displayedMessage) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDisplayedMessage(nextMessage);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [fakeProgress, displayedMessage, fadeAnim]);

  return (
    <Box
      flex={1}
      width="100%"
      alignItems="center"
      justifyContent="center"
      padding="m"
    >
      <Animated.View
        style={{ opacity: fadeAnim, minHeight: 40, justifyContent: "center" }}
      >
        <Text variant="infoTitle" textAlign="center">
          {displayedMessage}
        </Text>
      </Animated.View>
      <LottieView
        source={require("@/assets/animations/3d-loading.json")}
        autoPlay
        loop
        style={{ width: 220, height: 220 }}
      />
      <ProgressController />
    </Box>
  );
}
