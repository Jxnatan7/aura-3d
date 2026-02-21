import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";

export default function TabLayout() {
  const theme = useTheme<Theme>();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.extraBlack,
          borderBlockColor: theme.colors.gray900,
        },
        tabBarActiveTintColor: theme.colors.blue300,
        tabBarInactiveTintColor: theme.colors.mainText,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="home"
              size={28}
              color={focused ? theme.colors.blue300 : theme.colors.mainText}
            />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="create-model"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="plus-square-o"
              size={28}
              color={focused ? theme.colors.blue300 : theme.colors.mainText}
            />
          ),
          tabBarLabel: "Criar ",
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="user-circle"
              size={28}
              color={focused ? theme.colors.blue300 : theme.colors.mainText}
            />
          ),
          tabBarLabel: "Conta",
        }}
      />
    </Tabs>
  );
}
