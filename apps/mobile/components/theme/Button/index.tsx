import {
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
  Text,
  TextProps,
} from "@/components/restyle";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export type ButtonProps = RestyleTouchableOpacityProps & {
  text?: string;
  textProps?: TextProps;
};

export default function Button({
  text,
  textProps,
  variant = "default",
  children,
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
      style={[
        {
          overflow: "hidden", // Crucial para conter o blur e o gradiente
          borderRadius: 999, // Arredondamento total (Pill shape)
          minHeight: 56, // Altura base recomendada para esse estilo
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      {/* 1. O Fundo de Vidro Fosco */}
      <BlurView
        intensity={40} // Aumentado para dar mais consistência ao vidro
        tint="dark" // Use "dark" ou "light" dependendo do background da sua tela
        style={StyleSheet.absoluteFillObject}
      />

      {/* 2. O Brilho da Superfície (Liquid Effect) */}
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.45)", // Brilho forte no topo esquerdo
          "rgba(255, 255, 255, 0.05)", // Centro transparente
          "rgba(255, 255, 255, 0.20)", // Reflexo sutil na base direita
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 3. Destaque de Borda (Edge Highlighting) */}
      <View style={styles.borderHighlight} pointerEvents="none" />

      {/* 4. Conteúdo (Texto e Ícones) */}
      <View style={styles.contentContainer}>
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
      </View>
    </RestyleTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  borderHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 1.5,
    // Cria o efeito da luz batendo no topo do vidro e sumindo na base
    borderTopColor: "rgba(255, 255, 255, 0.8)",
    borderLeftColor: "rgba(255, 255, 255, 0.3)",
    borderRightColor: "rgba(255, 255, 255, 0.3)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  contentContainer: {
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32, // Espaçamento lateral do botão
    paddingVertical: 16,
  },
  text: {
    // Adiciona um leve brilho no próprio texto para combinar com o tema "liquid"
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
