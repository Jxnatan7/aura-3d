import {
  createRestyleComponent,
  createVariant,
  spacing,
  layout,
  backgroundColor,
  color,
  SpacingProps,
  LayoutProps,
  BackgroundColorProps,
  BorderProps,
  ColorProps,
  VariantProps,
  border,
} from "@shopify/restyle";
import { TouchableOpacityProps } from "react-native";
import type { Theme } from "@/theme";
import { Box } from "../Box";

const cardVariant = createVariant<Theme>({
  themeKey: "cardVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "cardVariants"> &
  TouchableOpacityProps;

export const RestyleCard = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    cardVariant,
  ],
  Box,
);

export type RestyleCardProps = React.ComponentProps<typeof RestyleCard>;
