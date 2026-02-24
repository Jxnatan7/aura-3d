import { Box, RestyleCard } from "@/components/restyle";
import { Model3D } from "@/services/Model3DService";
import { memo } from "react";
import { Platform, StyleSheet } from "react-native";
import { ModelImage } from "../ModelImage";
import { SCREEN_WIDTH } from "@/constants";
import { formatMediaUrl } from "@/utils/formatMediaUrl";
import { LinearGradient } from "expo-linear-gradient";

export type ModelItemProps = {
  item: Model3D;
  index: number;
  onPress: (item: Model3D, glbUrl?: string) => void;
  horizontal: boolean | null | undefined;
};

const CARD_WIDTH = Platform.select({
  web: (SCREEN_WIDTH - 56) / 6,
  default: (SCREEN_WIDTH - 56) / 2,
});

export const ModelItem = memo(
  ({ item, index, onPress, horizontal }: ModelItemProps) => {
    const glbUrl = formatMediaUrl(item, "glb");
    const imageUrl = formatMediaUrl(item, "image");

    return (
      <RestyleCard
        variant={horizontal ? "model-horizontal" : "model-vertical"}
        width={horizontal ? undefined : CARD_WIDTH}
        height={horizontal ? undefined : CARD_WIDTH}
        marginTop={index % 2 === 0 || horizontal ? "l" : "none"}
        marginBottom="minus"
        borderRadius={16}
        style={styles.cardWrapper}
      >
        <Box style={styles.glowContainer} pointerEvents="none">
          <LinearGradient
            colors={["#7b7b7b", "#222222"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, width: "100%", height: "100%", borderRadius: 16 }}
          />
        </Box>

        <Box
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ModelImage
            uri={imageUrl ?? ""}
            sharedTransitionTag={`image-${item._id}`}
            motiProps={{
              onPress: () => onPress(item, glbUrl),
            }}
          />
        </Box>
      </RestyleCard>
    );
  },
  (prevProps, nextProps) => prevProps.item._id === nextProps.item._id,
);

const styles = StyleSheet.create({
  cardWrapper: {
    // overflow: "hidden",
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  circleGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.5,
  },
});
