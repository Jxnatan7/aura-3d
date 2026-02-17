import { RestyleImage, RestyleImageProps } from "@/components/restyle";
import { MotiPressable } from "moti/interactions";
import React from "react";

export const ModelImage = ({
  uri,
  motiProps,
  imageProps,
}: {
  uri: string;
  motiProps?: React.ComponentProps<typeof MotiPressable>;
  imageProps?: RestyleImageProps;
}) => {
  return (
    <MotiPressable
      animate={({ hovered, pressed }) => {
        "worklet";
        return {
          scale: hovered || pressed ? 1.15 : 1,
        };
      }}
      transition={{
        type: "spring",
        damping: 15,
      }}
      {...motiProps}
    >
      <RestyleImage
        variant="model"
        source={{ uri }}
        contentFit="contain"
        {...imageProps}
      />
    </MotiPressable>
  );
};
