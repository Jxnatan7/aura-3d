import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { Box } from "@/components/restyle";
import { useViewerController } from "../../../hooks/useViewerController";
import { useImageTransition } from "@/hooks/useImageTransition";
import { useViewerUI } from "@/hooks/useViewerUI";
import { useMediaActions } from "@/hooks/useMediaActions";
import { ThreeScene } from "../ThreeScene";
import { ViewerOverlay } from "../ViewerOverlay";
import { LoadingState } from "../LoadingState";
import { DownloadModal } from "../DownloadModal";

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
  imageUrl?: string;
  sharedTransitionTag?: string;
};

export const ModelViewer = ({
  id,
  name = "Model",
  children,
  formats,
  initialRotation = [0, 0],
  autoRotate = true,
  imageUrl,
  sharedTransitionTag,
}: ModelViewerProps) => {
  const controller = useViewerController({
    initialRotation,
    autoRotate,
    initialZoom: 1.5,
  });

  const { isImageVisible, animatedImageStyle, handleModelLoaded } =
    useImageTransition();
  const { uiHidden, setUiHidden, animatedUiStyle, showUi } = useViewerUI();
  const {
    isRecording,
    setIsRecording,
    isDownloading,
    showDownloadModal,
    setShowDownloadModal,
    handleDownload,
    handleRecord,
  } = useMediaActions();

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onLoad: handleModelLoaded } as any);
    }
    return child;
  });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(showUi)();
  });

  const composedGestures = Gesture.Simultaneous(
    controller.gestures,
    tapGesture,
  );

  return (
    <Box style={[styles.container]}>
      {imageUrl && isImageVisible && (
        <Animated.Image
          source={{ uri: imageUrl }}
          // @ts-ignore
          sharedTransitionTag={sharedTransitionTag}
          style={[
            {
              zIndex: 10,
              width: "90%",
              height: "90%",
              position: "absolute",
              alignSelf: "center",
              bottom: "5%",
            },
            animatedImageStyle,
          ]}
          resizeMode="contain"
        />
      )}

      <ThreeScene
        controller={controller}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      >
        {childrenWithProps}
      </ThreeScene>

      <ViewerOverlay
        id={id}
        name={name}
        uiHidden={uiHidden}
        setUiHidden={setUiHidden}
        animatedUiStyle={animatedUiStyle}
        setShowDownloadModal={setShowDownloadModal}
        handleRecord={handleRecord}
      />

      <LoadingState isLoading={isRecording} message="Gerando GIF..." />
      <LoadingState isLoading={isImageVisible} message="Carregando modelo..." />
      <LoadingState isLoading={isDownloading} message="Baixando..." />

      <GestureDetector gesture={composedGestures}>
        <Box
          pointerEvents="auto"
          style={[StyleSheet.absoluteFill, { zIndex: 20 }]}
        />
      </GestureDetector>

      <DownloadModal
        name={name}
        visible={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        formats={formats}
        onDownload={handleDownload}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
