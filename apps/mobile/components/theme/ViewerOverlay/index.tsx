import React from "react";
import { StyleSheet } from "react-native";
import { RestyleCard, Text } from "@/components/restyle";
import { IconButton } from "../IconButton";
import { AntDesign, Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

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
        icon={<Feather name="download" size={20} color="#121212" />}
        onPress={() => setShowDownloadModal(true)}
        text="Baixar"
        flexDirection="row-reverse"
        gap="m"
        textProps={{ color: "black" }}
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
