import React, { Suspense, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";
import { Box, Text } from "@/components/restyle";
import { useViewerController } from "../useViewerController";
import { InteractiveStage } from "../InteractiveStage";
import Button from "../Button";
import * as MediaLibrary from "expo-media-library";
import { GifRecorder } from "../GifRecorder";
import { DirectionalPad } from "../ControlButton";
import * as THREE from "three";
import { GestureDetector } from "react-native-gesture-handler";

export type ModelViewerProps = {
  id: string;
  name: string;
  children: React.ReactNode;
  initialRotation?: [number, number];
  autoRotate?: boolean;
  showControls?: boolean;
  backgroundColor?: string;
};

const GL_CONFIG = {
  powerPreference: "high-performance",
  antialias: false,
  stencil: false,
  depth: true,
  alpha: true,
  preserveDrawingBuffer: true,
} as const;

const CameraZoom = ({ zoom }: { zoom: number }) => {
  const { camera } = useThree();

  useFrame(() => {
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoom, 0.1);
    camera.updateProjectionMatrix();
  });

  return null;
};

export const ModelViewer = ({
  id,
  name = "Model",
  children,
  initialRotation = [0, 0],
  autoRotate = true,
  showControls = true,
  backgroundColor = "#121212",
}: ModelViewerProps) => {
  const controller = useViewerController({ initialRotation, autoRotate });

  const [isRecording, setIsRecording] = useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const handleRecord = async () => {
    if (status?.status !== "granted") {
      await requestPermission();
    }
    setIsRecording(true);
  };

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      <Canvas
        frameloop="always"
        style={styles.canvas}
        gl={GL_CONFIG}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <CameraZoom zoom={controller.zoom} />

          <Environment preset="dawn" />
          <InteractiveStage controller={controller}>
            <Center>{children}</Center>
          </InteractiveStage>
          <GifRecorder
            recording={isRecording}
            onFinished={() => setIsRecording(false)}
          />
        </Suspense>
      </Canvas>

      {isRecording && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={20}
          justifyContent="center"
          alignItems="center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", margin: -20 }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </Box>
      )}

      <Box position="absolute" top={100} alignSelf="center" zIndex={10}>
        <Button
          variant="default"
          text={isRecording ? "Recording..." : "Create GIF"}
          onPress={handleRecord}
          disabled={isRecording}
          width="auto"
          padding="m"
        />
      </Box>

      <Box position="absolute" top={200} alignSelf="center" zIndex={10}>
        <Text variant="infoTitle" alignSelf="center" mb="s">
          {name}
        </Text>
        <Text variant="infoSubtitle">{id}</Text>
      </Box>

      <GestureDetector gesture={controller.gestures}>
        <Box pointerEvents="auto" style={StyleSheet.absoluteFill} />
      </GestureDetector>

      {showControls && <DirectionalPad controller={controller} />}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  canvas: { flex: 1 },
});
