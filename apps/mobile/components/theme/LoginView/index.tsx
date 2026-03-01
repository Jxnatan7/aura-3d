import React from "react";
import { Text } from "@/components/restyle";
import { IconButton } from "@/components/theme/IconButton";
import { AntDesign } from "@expo/vector-icons";

interface LoginViewProps {
  isRequestReady: boolean;
  onLoginPress: () => void;
}

export function LoginView({ isRequestReady, onLoginPress }: LoginViewProps) {
  return (
    <>
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
    </>
  );
}
