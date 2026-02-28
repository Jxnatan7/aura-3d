import React, { useEffect } from "react";
import { Container } from "@/components/theme/Container";
import { Text } from "@/components/restyle";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { IconButton } from "@/components/theme/IconButton";
import { AntDesign } from "@expo/vector-icons";
import { Platform } from "react-native";

const redirectUri = Platform.select({
  ios: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
  android: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
  web: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
});

WebBrowser.maybeCompleteAuthSession();

const CREDENTIALS = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  redirectUri: redirectUri,
};

export default function Login() {
  const [request, response, promptAsync] = Google.useAuthRequest(CREDENTIALS);

  useEffect(() => {
    console.log("🚀 ~ Login ~ response:", response);
    if (response?.type === "success") {
      const { authentication } = response;

      const idToken = authentication?.idToken;

      if (idToken) {
        enviarTokenParaOBackend(idToken);
      }
    }
  }, [response]);

  const enviarTokenParaOBackend = async (idToken: string) => {
    try {
      console.log("Enviando token para o NestJS...", idToken);
    } catch (error) {
      console.error("Erro ao enviar token para o backend:", error);
    }
  };

  return (
    <Container variant="screen" hideHeader justifyContent="center" gap="l">
      <Text variant="containerHeader">Faça o seu Login</Text>

      <IconButton
        variant="default"
        icon={<AntDesign name="google" size={24} color="#fff" />}
        text="Entrar com Google"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
        flexDirection="row"
        gap="m"
        alignItems="center"
        justifyContent="center"
        marginTop="m"
      />
    </Container>
  );
}

// TODO: ADD IN BUILD
//
// AuthSession.makeRedirectUri({
//   scheme: "com.jxnatan.aura3dmobile",
// });
