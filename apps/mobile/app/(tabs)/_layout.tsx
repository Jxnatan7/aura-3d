import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";
import { FloatingTabBar } from "@/components/theme/FloatingTabBar";

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="create-model" options={{ tabBarLabel: "Criar" }} />
      <Tabs.Screen name="login" options={{ tabBarLabel: "Conta" }} />
    </Tabs>
  );
}
