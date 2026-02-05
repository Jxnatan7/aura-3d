import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { ThemeProvider } from "@shopify/restyle";
import { StatusBar } from "expo-status-bar";
import KeyboardProvider from "@/contexts/KeyboardContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useAssets from "@/hooks/useAssets";
import { useAppStore } from "@/stores/appStore";
import { useDeviceTheme } from "@/hooks/useDeviceTheme";
import theme, { darkTheme } from "@/theme";

export { ErrorBoundary } from "expo-router";
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "dash",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appIsReady = useAssets();
  useDeviceTheme();

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useAppStore((state) => state.theme);
  const currentTheme = colorScheme === "dark" ? darkTheme : theme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <AuthProvider>
            <ThemeProvider theme={currentTheme}>
              <StatusBar style="inverted" />
              <Stack
                initialRouteName="index"
                screenOptions={{
                  headerShown: false,
                  animation: "flip",
                  animationDuration: 300,
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="model-view" />
                <Stack.Screen name="model-preview" />
                <Stack.Screen name="create-model" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="awaiting-validation" />
              </Stack>
            </ThemeProvider>
          </AuthProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
