import { RestyleImage, RestyleImageProps } from "@/components/restyle";
import { MotiPressable } from "moti/interactions";
import React, { useRef } from "react";
import { Platform, Pressable, Animated } from "react-native";
import ReAnimated from "react-native-reanimated";

export const AnimatedRestyleImage =
  ReAnimated.createAnimatedComponent(RestyleImage);

const ModelImageWeb = ({
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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.1,
      damping: 15,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 15,
      useNativeDriver: true,
    }).start();
  };

  const { onPress, ...restMotiProps } = motiProps ?? {};

  return (
    <Pressable
      onPress={onPress as any}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handlePressIn}
      onHoverOut={handlePressOut}
      {...(restMotiProps as any)}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        transform: [{ scale }],
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale }],
        }}
      >
        <AnimatedRestyleImage
          variant="model"
          source={{ uri }}
          contentFit="contain"
          // @ts-ignore
          sharedTransitionTag={sharedTransitionTag}
          {...imageProps}
        />
      </Animated.View>
    </Pressable>
  );
};

const ModelImageNative = ({
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

export const ModelImage =
  Platform.OS === "web" ? ModelImageWeb : ModelImageNative;
