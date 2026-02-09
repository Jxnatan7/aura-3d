import React, { Suspense, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";
import { Box, Text } from "@/components/restyle";
import { useViewerController } from "../useViewerController";
import { InteractiveStage } from "../InteractiveStage";
import Button from "../Button";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { GifRecorder } from "../GifRecorder";
import { DirectionalPad } from "../ControlButton";
import * as THREE from "three";
import { GestureDetector } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

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
  backgroundColor = "#121212",
}: ModelViewerProps) => {
  const controller = useViewerController({ initialRotation, autoRotate });

  const [isRecording, setIsRecording] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [status, requestPermission] = MediaLibrary.usePermissions();

  const handleDownload = async (url: string, extension: string) => {
    try {
      setShowDownloadModal(false);
      setIsDownloading(true);

      const fixedName = name;
      const fileNameWithExt = `${fixedName}.${extension}`;

      const mimeType =
        extension === "glb"
          ? "model/gltf-binary"
          : extension === "usdz"
            ? "model/vnd.usdz+zip"
            : "application/octet-stream";

      const tempFileUri = FileSystem.documentDirectory + fileNameWithExt;
      const downloadRes = await FileSystem.downloadAsync(url, tempFileUri);

      if (downloadRes.status !== 200) {
        throw new Error("Erro ao baixar arquivo da internet");
      }

      if (Platform.OS === "android") {
        const { StorageAccessFramework } = FileSystem;

        const permissions =
          await StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const fileString = await FileSystem.readAsStringAsync(
            downloadRes.uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            },
          );

          const createdUri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fixedName,
            mimeType,
          );

          await StorageAccessFramework.writeAsStringAsync(
            createdUri,
            fileString,
            {
              encoding: FileSystem.EncodingType.Base64,
            },
          );

          Alert.alert("Sucesso", "Modelo salvo na pasta Downloads!");
        } else {
          setIsDownloading(false);
          return;
        }
      } else {
        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert("Erro", "Compartilhamento não disponível");
          return;
        }

        await Sharing.shareAsync(downloadRes.uri, {
          UTI: extension === "usdz" ? "com.apple.usdz-archive" : "public.item",
          mimeType: mimeType,
          dialogTitle: `Salvar ${fileNameWithExt}`,
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível baixar e salvar o modelo.");
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

      {(isRecording || isDownloading) && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={20}
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

      {availableFormats.length > 0 && (
        <Button
          variant="icon"
          style={[
            {
              position: "absolute",
              right: 10,
              top: 0,
              zIndex: 9999,
              elevation: 9999,
              width: 40,
              height: 40,
              borderRadius: 4,
              backgroundColor: "#2ECC71",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            (isRecording || isDownloading) && styles.disabledButton,
          ]}
          onPress={() => setShowDownloadModal(true)}
          disabled={isRecording || isDownloading}
        >
          <Feather name="download" size={18} color="white" />
        </Button>
      )}

      <Box
        position="absolute"
        top={100}
        alignSelf="center"
        zIndex={10}
        gap="s"
        alignItems="center"
      >
        <Button
          variant="default"
          text="Criar GIF"
          onPress={handleRecord}
          disabled={isRecording || isDownloading}
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
  downloadButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
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
