import React, { Suspense } from "react";
import { StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";
import { InteractiveStage } from "../InteractiveStage";
import { GifRecorder } from "../GifRecorder";
import * as THREE from "three";
import { CameraZoom } from "../CameraZoom";
import { MaterialEnhancer } from "../MaterialEnhancer";

export const GL_CONFIG = {
  powerPreference: "high-performance",
  antialias: true,
  stencil: false,
  depth: true,
  alpha: true,
  preserveDrawingBuffer: true,
} as const;

export const ThreeScene = ({
  controller,
  children,
  isRecording,
  setIsRecording,
}: any) => (
  <Canvas
    frameloop="always"
    style={styles.canvas}
    gl={{
      ...GL_CONFIG,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.2,
    }}
    performance={{ min: 0.5 }}
  >
    <Suspense fallback={null}>
      <CameraZoom zoom={controller.zoom} />
      <MaterialEnhancer />
      <Environment preset="city" />
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />
      <pointLight
        position={[-10, 0, -5]}
        intensity={80}
        distance={25}
        color="#ff00ff"
      />
      <pointLight
        position={[10, 0, 5]}
        intensity={80}
        distance={25}
        color="#00ffff"
      />
      <InteractiveStage controller={controller}>
        <Center>{children}</Center>
      </InteractiveStage>
      <GifRecorder
        recording={isRecording}
        onFinished={() => setIsRecording(false)}
      />
    </Suspense>
  </Canvas>
);

const styles = StyleSheet.create({
  canvas: { flex: 1, zIndex: 5 },
});
