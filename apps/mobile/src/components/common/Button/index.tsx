import {
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
  Text,
  TextProps,
} from "@/src/components/restyle";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { StyleSheet } from "react-native";
import { LiquidGlassView, LiquidGlassViewProps } from "../LiquidGlassView";

export type ButtonProps = RestyleTouchableOpacityProps & {
  text?: string;
  textProps?: TextProps;
  glass?: boolean;
  glassProps?: LiquidGlassViewProps;
};

export default function Button({
  text,
  textProps,
  variant = "default",
  children,
  glass = true,
  glassProps,
  ...props
}: ButtonProps) {
  const theme = useTheme<Theme>();

  const btnVariant =
    // @ts-ignore
    theme.buttonVariants?.[variant] ?? theme.buttonVariants.default;

  const textColorToken = btnVariant?.color ?? "buttonTextLight";

  return (
    <RestyleTouchableOpacity
      activeOpacity={0.7}
      variant={variant}
      {...props}
      style={[styles.touchable, props.style]}
    >
      {glass && (
        <LiquidGlassView
          style={[StyleSheet.absoluteFillObject, props.style]}
          contentContainerStyle={[styles.contentContainer, props.style]}
          {...glassProps}
        />
      )}

      {text && (
        <Text
          variant="button"
          {...textProps}
          color={(textProps?.color ?? textColorToken) as any}
          style={styles.text}
        >
          {text}
        </Text>
      )}
      {children}
    </RestyleTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
