import React from "react";
import { Box, Text } from "@/src/components/restyle";
import { IconButton } from "@/src/components/theme/IconButton";
import { AntDesign } from "@expo/vector-icons";

interface LoginViewProps {
  isRequestReady: boolean;
  onLoginPress: () => void;
}

export function LoginView({ isRequestReady, onLoginPress }: LoginViewProps) {
  return (
    <Box
      flex={1}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap="l"
    >
      <Text variant="containerHeader">Faça o seu Login</Text>

      <IconButton
        variant="default"
        icon={<AntDesign name="google" size={24} color="#fff" />}
        text="Entrar com Google"
        disabled={!isRequestReady}
        onPress={onLoginPress}
        flexDirection="row"
        gap="m"
        alignItems="center"
        justifyContent="center"
        marginTop="m"
      />
    </Box>
  );
}
