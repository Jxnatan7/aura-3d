import { Box, RestyleCard, Text } from "@/components/restyle";
import { Model3D } from "@/services/Model3DService";
import { memo } from "react";
import { Platform, StyleSheet } from "react-native";
import { ModelImage } from "../ModelImage";
import { SCREEN_WIDTH } from "@/constants";
import { formatMediaUrl } from "@/utils/formatMediaUrl";
import { LiquidGlassView } from "../LiquidGlassView";
import { IconButton } from "../IconButton";
import { Feather } from "@expo/vector-icons";

export type ModelItemProps = {
  item: Model3D;
  index: number;
  onPress: (item: Model3D, glbUrl?: string) => void;
  horizontal: boolean | null | undefined;
  onLike: () => void;
};

const CARD_WIDTH = Math.min(
  Platform.select({
    web: (SCREEN_WIDTH - 56) / 2,
    default: (SCREEN_WIDTH - 56) / 2,
  }),
  400,
);

export const ModelItem = memo(
  ({ item, index, onPress, horizontal, onLike }: ModelItemProps) => {
    console.log("🚀 ~ item:", item.isLikedByMe);
    const glbUrl = formatMediaUrl(item, "glb");
    const imageUrl = formatMediaUrl(item, "image");

    return (
      <RestyleCard
        variant={horizontal ? "model-horizontal" : "model-vertical"}
        width={horizontal ? undefined : CARD_WIDTH}
        height={horizontal ? undefined : CARD_WIDTH * 1.25}
        marginTop={index % 2 === 0 || horizontal ? "l" : "none"}
        marginBottom="minus"
        borderRadius={16}
        style={styles.cardWrapper}
      >
        <LiquidGlassView
          intensity={20}
          tint="dark"
          borderRadius={16}
          style={StyleSheet.absoluteFillObject}
        />

        <Box
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 11,
          }}
        >
          <ModelImage
            uri={imageUrl ?? ""}
            sharedTransitionTag={`image-${item.id}`}
            motiProps={{
              onPress: () => onPress(item, glbUrl),
            }}
          />
        </Box>

        <Box
          flex={1}
          position="absolute"
          bottom={12}
          width="90%"
          height={50}
          padding="s"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          zIndex={99}
        >
          <LiquidGlassView
            intensity={15}
            tint="dark"
            borderRadius={8}
            style={StyleSheet.absoluteFillObject}
          />
          <Box>
            <Text
              fontFamily="StackSansNotch-Bold"
              fontSize={14}
              color="white"
              maxWidth="100%"
              numberOfLines={1}
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {String(item.name).toUpperCase()}
            </Text>
            <Text
              fontFamily="StackSansNotch-Medium"
              fontSize={12}
              color="gray300"
              numberOfLines={2}
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              AURA3D
            </Text>
          </Box>
          <IconButton
            onPress={onLike}
            glass={false}
            backgroundColor="transparent"
            icon={
              <Feather
                name="heart"
                size={20}
                color={item.isLikedByMe ? "red" : "#fff"}
              />
            }
          />
        </Box>
      </RestyleCard>
    );
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id,
);

const styles = StyleSheet.create({
  cardWrapper: {},
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
