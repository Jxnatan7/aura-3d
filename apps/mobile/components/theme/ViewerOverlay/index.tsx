import React from "react";
import { StyleSheet } from "react-native";
import { RestyleCard, Text } from "@/components/restyle";
import { IconButton } from "../IconButton";
import { AntDesign, Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { LiquidGlassView } from "../LiquidGlassView";

export const ViewerOverlay = ({
  name,
  uiHidden,
  setUiHidden,
  animatedUiStyle,
  setShowDownloadModal,
  handleRecord,
}: any) => (
  <>
    <Animated.View
      pointerEvents={uiHidden ? "none" : "auto"}
      style={[styles.topOverlay, animatedUiStyle]}
    >
      <LiquidGlassView style={{ flex: 1, width: "100%" }}>
        <RestyleCard variant="modelInfo">
          <Text variant="modelName">{String(name).toUpperCase()}</Text>
          <IconButton
            onPress={() => setUiHidden(true)}
            icon={
              <AntDesign
                name={uiHidden ? "shrink" : "expand-alt"}
                size={24}
                color="#CECECE"
              />
            }
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
        backgroundColor="black"
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
