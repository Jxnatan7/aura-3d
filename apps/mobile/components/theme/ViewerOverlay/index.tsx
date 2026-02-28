import React from "react";
import { StyleSheet } from "react-native";
import { Box, RestyleCard, Text } from "@/components/restyle";
import { IconButton } from "../IconButton";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { LiquidGlassView } from "../LiquidGlassView";
import { useModelActions } from "@/hooks/useModelActions";

export const ViewerOverlay = ({
  id,
  name,
  uiHidden,
  setUiHidden,
  animatedUiStyle,
  setShowDownloadModal,
  handleRecord,
}: any) => {
  const { handleNext, handlePrev, hasNext, hasPrev } = useModelActions(id);
  return (
    <>
      {hasPrev && (
        <Box position="absolute" padding="m" top="50%" left={0} zIndex={50}>
          <IconButton
            width={40}
            height={40}
            icon={<Feather name="arrow-left" size={20} color="#FFF" />}
            onPress={handlePrev}
          />
        </Box>
      )}

      {hasNext && (
        <Box position="absolute" padding="m" top="50%" right={0} zIndex={50}>
          <IconButton
            width={40}
            height={40}
            icon={<Feather name="arrow-right" size={20} color="#FFF" />}
            onPress={handleNext}
          />
        </Box>
      )}

      <Animated.View
        pointerEvents={uiHidden ? "none" : "auto"}
        style={[styles.topOverlay, animatedUiStyle]}
      >
        <LiquidGlassView style={{ flex: 1, width: "100%" }}>
          <RestyleCard variant="modelInfo">
            <Box>
              <Text variant="modelName">{String(name).toUpperCase()}</Text>
              <Text variant="modelUser">AURA3D</Text>
            </Box>
            <IconButton
              icon={<Feather name="heart" size={24} color="#FFF" />}
            />
          </RestyleCard>
        </LiquidGlassView>
      </Animated.View>

      <Animated.View
        pointerEvents={uiHidden ? "none" : "auto"}
        style={[styles.bottomOverlay, animatedUiStyle]}
      >
        <IconButton
          width="45%"
          flex={1}
          height={40}
          backgroundColor="white"
          flexDirection="row-reverse"
          gap="m"
          icon={<Feather name="download" size={20} color="#121212" />}
          onPress={() => setShowDownloadModal(true)}
          text="Baixar"
          textProps={{ color: "black" }}
          style={{
            gap: 10,
          }}
        />
        <IconButton
          width="45%"
          flex={1}
          height={40}
          onPress={handleRecord}
          icon={<Feather name="camera" size={20} color="#CECECE" />}
          text="GIF"
          flexDirection="row-reverse"
          gap="m"
          textProps={{ color: "white" }}
          style={{
            gap: 10,
          }}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  topOverlay: {
    position: "absolute",
    width: "100%",
    bottom: 120,
    zIndex: 21,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  bottomOverlay: {
    position: "absolute",
    width: "100%",
    bottom: 60,
    zIndex: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
});
