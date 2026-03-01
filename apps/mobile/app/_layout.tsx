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
import { ModelContextProvider } from "@/contexts/ModelContext";
import { MobileWebPrompt } from "@/components/theme/MobileWebPrompt";
import { ModelListProvider } from "@/contexts/ModelListContext";

export { ErrorBoundary } from "expo-router";
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(tabs)",
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
            <ModelContextProvider>
              <ModelListProvider>
                <ThemeProvider theme={currentTheme}>
                  <StatusBar style="light" />
                  <MobileWebPrompt />
                  <Stack
                    initialRouteName="(tabs)"
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="model-preview" />
                    <Stack.Screen name="model-view" />
                  </Stack>
                </ThemeProvider>
              </ModelListProvider>
            </ModelContextProvider>
          </AuthProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
