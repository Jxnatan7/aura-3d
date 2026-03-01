import { useEffect } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuthStore } from "@/stores/authStore";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = Platform.select({
  ios: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
  android: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
  web: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
});

const CREDENTIALS = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  redirectUri: redirectUri,
};

export function useGoogleAuth() {
  const { googleLogin, isAuthenticated, user } = useAuthStore();
  const [request, response, promptAsync] = Google.useAuthRequest(CREDENTIALS);

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication?.accessToken;

      if (accessToken) {
        googleLogin(accessToken);
      }
    }
  }, [response, googleLogin]);

  return {
    request,
    promptAsync,
    isAuthenticated,
    user,
  };
}
