import {
  Box,
  RestyleCard,
  RestyleTouchableOpacity,
  Text,
} from "@/components/restyle";
import { Model3D } from "@/services/Model3DService";
import { memo } from "react";
import { Platform, StyleSheet } from "react-native";
import { ModelImage } from "../ModelImage";
import { SCREEN_WIDTH } from "@/constants";
import { formatMediaUrl } from "@/utils/formatMediaUrl";
import { Feather } from "@expo/vector-icons";
import { LiquidGlassView } from "../LiquidGlassView";

export type ModelItemProps = {
  item: Model3D;
  index: number;
  onPress: (item: Model3D, glbUrl?: string) => void;
  horizontal: boolean | null | undefined;
};

const CARD_WIDTH = Platform.select({
  web: (SCREEN_WIDTH - 56) / 2,
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
        <LiquidGlassView
          intensity={15}
          tint="dark"
          borderRadius={16}
          style={StyleSheet.absoluteFillObject}
        />

        <Box
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 11,
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

        <Box flex={1} maxWidth="90%" position="absolute" top={10} left={10}>
          <Text
            fontFamily="StackSansNotch-Bold"
            fontSize={24}
            color="white"
            numberOfLines={2}
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.3)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {String(item.name).toUpperCase()}
          </Text>
        </Box>

        <RestyleTouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPress(item, glbUrl)}
          backgroundColor="transparent"
          style={{
            width: 40,
            height: 40,
            bottom: 10,
            right: 10,
            position: "absolute",
            alignSelf: "flex-end",
            zIndex: 12,
            borderRadius: 999,
          }}
        >
          <LiquidGlassView
            intensity={15}
            tint="light"
            borderRadius={999}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Feather name="arrow-right" size={20} color="white" />
          </LiquidGlassView>
        </RestyleTouchableOpacity>
      </RestyleCard>
    );
  },
  (prevProps, nextProps) => prevProps.item._id === nextProps.item._id,
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
