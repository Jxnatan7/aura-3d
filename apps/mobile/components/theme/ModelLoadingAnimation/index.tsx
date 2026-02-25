import React, { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Box, Text } from "@/components/restyle";
import LottieView from "lottie-react-native";
import { ProgressController } from "../ProgressController";

const LOADING_MESSAGES = [
  "Lendo imagem...",
  "Processando geometria...",
  "Criando modelo...",
  "Refinando texturas...",
  "Ajustando iluminação...",
  "Finalizando detalhes...",
];

export function ModelLoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);
  const duration = 400;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        setMessageIndex(
          (prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length,
        );

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }).start();
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <Box
      flex={1}
      width="100%"
      alignItems="center"
      justifyContent="center"
      padding="m"
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text variant="infoTitle" textAlign="center">
          {LOADING_MESSAGES[messageIndex]}
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
