import React from "react";
import {
  StyleSheet,
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export type LiquidGlassViewProps = ViewProps & {
  intensity?: number;
  tint?:
    | "light"
    | "dark"
    | "default"
    | "transparent"
    | "systemThinMaterial"
    | "systemChromeMaterial";
  borderRadius?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function LiquidGlassView({
  intensity = 40,
  tint = "dark",
  borderRadius = 16,
  style,
  contentContainerStyle,
  children,
  ...props
}: LiquidGlassViewProps) {
  return (
    <View
      style={[
        {
          borderRadius,
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      <BlurView
        intensity={intensity}
        // @ts-ignore
        tint={tint}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.45)",
          "rgba(255, 255, 255, 0.05)",
          "rgba(255, 255, 255, 0.20)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius,
            borderWidth: 1.5,
            borderTopColor: "rgba(255, 255, 255, 0.8)",
            borderLeftColor: "rgba(255, 255, 255, 0.3)",
            borderRightColor: "rgba(255, 255, 255, 0.3)",
            borderBottomColor: "rgba(255, 255, 255, 0.05)",
          },
        ]}
        pointerEvents="none"
      />

      <View style={[{ flex: 1, zIndex: 2 }, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
}
