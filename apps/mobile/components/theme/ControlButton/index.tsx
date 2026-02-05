import { Box, RestyleTouchableOpacityProps, Text } from "@/components/restyle";
import React, { useState } from "react";
import { ViewerController } from "../useViewerController";
import {
  LayoutAnimation,
  Platform,
  StyleProp,
  StyleSheet,
  UIManager,
  ViewStyle,
} from "react-native";
import Button from "../Button";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ControlButtonProps = {
  label: string;
  onPress: () => void;
} & RestyleTouchableOpacityProps;

export const ControlButton = React.memo(
  ({ label, onPress, ...props }: ControlButtonProps) => (
    <Button
      style={[styles.button]}
      onPress={onPress}
      activeOpacity={0.5}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      height={50}
      backgroundColor="gray800"
      {...props}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Button>
  ),
);

export type DirectionalPadProps = {
  controller: ViewerController;
  style?: StyleProp<ViewStyle>;
};

export const DirectionalPad = ({ controller, style }: DirectionalPadProps) => {
  const { setDirection, resetRotation, adjustZoom } = controller;
  const [showZoom, setShowZoom] = useState(false);
  const [showDirectional, setShowDirectional] = useState(true);

  const speed = 0.01;
  const zoomStep = 0.2;

  const toggleZoomControls = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowZoom((prev) => !prev);
  };

  const toggleDirectionalControls = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDirectional((prev) => !prev);
  };

  return (
    <Box style={[styles.controlsContainer, style]}>
      {showDirectional && (
        <Box>
          <Box style={styles.buttonRow}>
            <ControlButton
              label="↖"
              onPress={() => setDirection(-speed, -speed)}
            />
            <ControlButton label="↑" onPress={() => setDirection(-speed, 0)} />
            <ControlButton
              label="↗"
              onPress={() => setDirection(-speed, speed)}
            />
          </Box>
          <Box style={styles.buttonRow}>
            <ControlButton label="←" onPress={() => setDirection(0, -speed)} />
            <ControlButton
              label="R"
              onPress={resetRotation}
              backgroundColor="red"
            />
            <ControlButton label="→" onPress={() => setDirection(0, speed)} />
          </Box>
          <Box style={styles.buttonRow}>
            <ControlButton
              label="↙"
              onPress={() => setDirection(speed, -speed)}
            />
            <ControlButton label="↓" onPress={() => setDirection(speed, 0)} />
            <ControlButton
              label="↘"
              onPress={() => setDirection(speed, speed)}
            />
          </Box>
        </Box>
      )}
      <Box
        style={[styles.buttonRow, { marginBottom: showZoom ? 10 : 0 }]}
        justifyContent="center"
      >
        <ControlButton
          label={showZoom ? "▼" : "▲"}
          onPress={toggleZoomControls}
          flex={1}
          height={30}
        />
        <ControlButton
          label={showDirectional ? "▼" : "▲"}
          onPress={toggleDirectionalControls}
          flex={1}
          height={30}
        />
      </Box>
      {showZoom && (
        <Box style={styles.buttonRow} justifyContent="center" padding="xs">
          <ControlButton label="—" onPress={() => adjustZoom(-zoomStep)} />
          <Box width={50} justifyContent="center" alignItems="center">
            <Text style={[styles.buttonText, { fontSize: 12 }]}>ZOOM</Text>
          </Box>
          <ControlButton label="+" onPress={() => adjustZoom(zoomStep)} />
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    minWidth: 170,
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    zIndex: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    opacity: 0.7,
  },
  resetButton: {
    backgroundColor: "rgba(255, 100, 100, 0.3)",
    borderColor: "rgba(255, 100, 100, 0.5)",
    borderWidth: 1,
  },
  secondaryButton: {
    backgroundColor: "rgba(100, 200, 255, 0.2)",
    borderColor: "rgba(100, 200, 255, 0.4)",
    borderWidth: 1,
    height: 35,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
