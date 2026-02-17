import React, { Suspense, useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";
import { Box, RestyleCard, Text } from "@/components/restyle";
import { useViewerController } from "../useViewerController";
import { InteractiveStage } from "../InteractiveStage";
import * as MediaLibrary from "expo-media-library";
import { GifRecorder } from "../GifRecorder";
import * as THREE from "three";
import { IconButton } from "../IconButton";
import { AntDesign, Feather } from "@expo/vector-icons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";

export type ModelFormats = {
  glb?: string;
  fbx?: string;
  obj?: string;
  usdz?: string;
};

export type ModelViewerProps = {
  id: string;
  name: string;
  children: React.ReactNode;
  formats: ModelFormats;
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
  formats,
  initialRotation = [0, 0],
  autoRotate = true,
  showControls = true,
  backgroundColor = "#000",
}: ModelViewerProps) => {
  const controller = useViewerController({
    initialRotation,
    autoRotate,
    initialZoom: 1.5,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const uiOffset = useSharedValue(0);

  useEffect(() => {
    uiOffset.value = withTiming(uiHidden ? 300 : 0, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
  }, [uiHidden]);

  const animatedUiStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: uiOffset.value }],
    };
  });

  const showUi = () => {
    if (uiHidden) {
      setUiHidden(false);
    }
  };

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(showUi)();
  });

  const composedGestures = Gesture.Simultaneous(
    controller.gestures,
    tapGesture,
  );

  const handleDownload = async (url: string, extension: string) => {
    setShowDownloadModal(false);
    try {
      setIsDownloading(true);
      Alert.alert("Sucesso", "Simulação de download...");
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRecord = async () => {
    if (status?.status !== "granted") {
      await requestPermission();
    }
    setIsRecording(true);
  };

  const availableFormats = Object.entries(formats).filter(([_, url]) => !!url);

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

      <Animated.View
        pointerEvents={uiHidden ? "none" : "auto"}
        style={[
          {
            position: "absolute",
            width: "100%",
            bottom: 120,
            zIndex: 20,
            justifyContent: "center",
            alignItems: "center",
          },
          animatedUiStyle,
        ]}
      >
        <RestyleCard variant="modelInfo">
          <Text variant="modelName">{name}</Text>
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
        style={[
          {
            position: "absolute",
            width: "100%",
            bottom: 60,
            zIndex: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 16,
          },
          animatedUiStyle,
        ]}
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

      {(isRecording || isDownloading) && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={30}
          justifyContent="center"
          alignItems="center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={{ color: "white", marginTop: 10 }}>
            {isRecording ? "Gerando GIF..." : "Salvando arquivo..."}
          </Text>
        </Box>
      )}

      <GestureDetector gesture={composedGestures}>
        <Box pointerEvents="auto" style={StyleSheet.absoluteFill} />
      </GestureDetector>

      <Modal
        visible={showDownloadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDownloadModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDownloadModal(false)}
        >
          <Box
            style={styles.modalContent}
            // @ts-ignore
            onStartShouldSetResponder={() => true}
          >
            <Text
              variant="infoTitle"
              style={{ color: "black", marginBottom: 15 }}
            >
              Escolha o formato
            </Text>

            {availableFormats.map(([ext, url]) => (
              <TouchableOpacity
                key={ext}
                style={styles.formatButton}
                // @ts-ignore
                onPress={() => handleDownload(url as string, ext)}
              >
                <Text style={styles.formatButtonText}>
                  .{ext.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.formatButton,
                { borderBottomWidth: 0, marginTop: 10 },
              ]}
              onPress={() => setShowDownloadModal(false)}
            >
              <Text style={[styles.formatButtonText, { color: "red" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Box>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    alignItems: "center",
  },
  formatButton: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  formatButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
