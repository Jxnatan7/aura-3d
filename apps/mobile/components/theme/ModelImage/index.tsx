import { RestyleImage, RestyleImageProps } from "@/components/restyle";
import { MotiPressable } from "moti/interactions";
import React from "react";
import Animated from "react-native-reanimated";

export const AnimatedRestyleImage =
  Animated.createAnimatedComponent(RestyleImage);

export const ModelImage = ({
  uri,
  motiProps,
  imageProps,
  sharedTransitionTag,
}: {
  uri: string;
  motiProps?: React.ComponentProps<typeof MotiPressable>;
  imageProps?: RestyleImageProps;
  sharedTransitionTag?: string;
}) => {
  return (
    <MotiPressable
      animate={({ hovered, pressed }) => {
        "worklet";
        return {
          scale: hovered || pressed ? 1.1 : 1,
        };
      }}
      transition={{
        type: "spring",
        damping: 15,
      }}
      {...motiProps}
    >
      <AnimatedRestyleImage
        variant="model"
        source={{ uri }}
        contentFit="contain"
        // @ts-ignore
        sharedTransitionTag={sharedTransitionTag}
        {...imageProps}
      />
    </MotiPressable>
  );
};
