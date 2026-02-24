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
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { IconButton } from "../IconButton";
import { Feather } from "@expo/vector-icons";

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
        <BlurView
          intensity={5}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            borderRadius: 16,
          }}
        />

        <Box style={styles.glowContainer} pointerEvents="none">
          <LinearGradient
            colors={["#000000", "#424242"]}
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

        <RestyleTouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPress(item, glbUrl)}
          backgroundColor="transparent"
          style={{
            position: "absolute",
            bottom: 12,
            zIndex: 12,
            width: 330,
            height: 70,
            alignItems: "flex-start",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <BlurView
            intensity={50}
            tint="light"
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: 8,
              overflow: "hidden",
            }}
          >
            <Box maxWidth="60%">
              <Text
                fontFamily="Sekuya-Regular"
                fontSize={24}
                color="white"
                numberOfLines={1}
              >
                {String(item.name).toUpperCase()}
              </Text>
              <Box flexDirection="row">
                <Text
                  fontFamily="MulishFontSemiBold"
                  fontSize={16}
                  color="white"
                >
                  by{" "}
                </Text>
                <Text
                  fontFamily="MulishFontSemiBold"
                  fontSize={16}
                  color="blue300"
                >
                  Aura3D
                </Text>
              </Box>
            </Box>
            <IconButton
              icon={<Feather name="arrow-right" size={24} color="white" />}
            />
          </BlurView>
        </RestyleTouchableOpacity>
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
