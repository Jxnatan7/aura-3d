import React, { Suspense, useRef } from "react";
import {
  PanResponder,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";

type SceneProps = {
  children: React.ReactNode;
  initialRotation?: [number, number];
  rotationSensitivity?: number;
  autoRotate?: boolean;
};

export const Scene = ({
  children,
  initialRotation = [0, 0],
  rotationSensitivity = 0.005,
  autoRotate = true,
}: SceneProps) => {
  const rotationRef = useRef({ x: initialRotation[0], y: initialRotation[1] });
  const buttonDirection = useRef({ x: 0, y: 0 });
  const isInteracting = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isInteracting.current = true;
        buttonDirection.current = { x: 0, y: 0 };
      },
      onPanResponderMove: (_, state) => {
        rotationRef.current.y += state.vx * (rotationSensitivity * 15);
        rotationRef.current.x += state.vy * (rotationSensitivity * 15);
      },
      onPanResponderRelease: () => {
        isInteracting.current = false;
      },
    }),
  ).current;

  const setDirection = (x: number, y: number) => {
    buttonDirection.current = { x, y };
  };

  const resetRotation = () => {
    buttonDirection.current = { x: 0, y: 0 };
    rotationRef.current = { x: initialRotation[0], y: initialRotation[1] };
  };

  return (
    <View style={styles.container}>
      <Canvas
        frameloop="always"
        style={styles.canvas}
        gl={{
          toneMappingExposure: 1.5,
          outputColorSpace: "srgb",
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <RotatingGroup
            rotationRef={rotationRef}
            buttonDirection={buttonDirection}
            autoRotate={autoRotate}
            isInteracting={isInteracting}
          >
            <Center>{children}</Center>
          </RotatingGroup>
        </Suspense>
      </Canvas>

      <View
        style={StyleSheet.absoluteFill}
        {...panResponder.panHandlers}
        pointerEvents="box-none"
      />

      <View style={styles.controlsContainer}>
        <View style={styles.buttonRow}>
          <ControlButton label="↖" onPress={() => setDirection(-0.02, -0.02)} />
          <ControlButton label="↑" onPress={() => setDirection(-0.02, 0)} />
          <ControlButton label="↗" onPress={() => setDirection(-0.02, 0.02)} />
        </View>

        <View style={styles.buttonRow}>
          <ControlButton label="←" onPress={() => setDirection(0, -0.02)} />
          <ControlButton label="R" onPress={resetRotation} highlight />
          <ControlButton label="→" onPress={() => setDirection(0, 0.02)} />
        </View>

        <View style={styles.buttonRow}>
          <ControlButton label="↙" onPress={() => setDirection(0.02, -0.02)} />
          <ControlButton label="↓" onPress={() => setDirection(0.02, 0)} />
          <ControlButton label="↘" onPress={() => setDirection(0.02, 0.02)} />
        </View>
      </View>
    </View>
  );
};

function RotatingGroup({
  rotationRef,
  buttonDirection,
  autoRotate,
  isInteracting,
  children,
}: any) {
  const groupRef = useRef<any>(null);

  useFrame(() => {
    if (groupRef.current) {
      const isMovingByButton =
        buttonDirection.current.x !== 0 || buttonDirection.current.y !== 0;

      if (autoRotate && !isInteracting.current && !isMovingByButton) {
        rotationRef.current.y += 0.005;
      }

      rotationRef.current.x += buttonDirection.current.x;
      rotationRef.current.y += buttonDirection.current.y;

      groupRef.current.rotation.x +=
        (rotationRef.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y +=
        (rotationRef.current.y - groupRef.current.rotation.y) * 0.05;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

const ControlButton = ({ label, onPress, highlight }: any) => (
  <TouchableOpacity
    style={[styles.button, highlight && styles.resetButton]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  canvas: { flex: 1 },
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  resetButton: {
    backgroundColor: "rgba(255, 100, 100, 0.3)",
    borderColor: "rgba(255, 100, 100, 0.5)",
    borderWidth: 1,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default Scene;
