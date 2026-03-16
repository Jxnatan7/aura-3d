import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber/native";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, InteractionManager, Platform } from "react-native";
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import {
  WebGLRenderTarget,
  RGBAFormat,
  UnsignedByteType,
  LinearFilter,
  PerspectiveCamera,
} from "three";

global.Buffer = global.Buffer || Buffer;

const GIF_WIDTH = 500;
const GIF_HEIGHT = 500;
const MAX_FRAMES = 30;
const FRAME_SKIP = 4;
const VIEW_ROTATION_SPEED = 0.005;
const GIF_ADDITIONAL_ROTATION = 0.1;

export const GifRecorder = ({
  recording,
  onFinished,
}: {
  recording: boolean;
  onFinished: () => void;
}) => {
  const framesRef = useRef<Uint8Array[]>([]);
  const isFinished = useRef(false);
  const frameCounter = useRef(0);
  const gifRotationOffset = useRef(0);

  const renderTarget = useRef<WebGLRenderTarget | null>(null);

  useEffect(() => {
    renderTarget.current = new WebGLRenderTarget(GIF_WIDTH, GIF_HEIGHT, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true,
    });

    return () => {
      renderTarget.current?.dispose();
    };
  }, []);

  useFrame((state) => {
    const { gl, scene, camera } = state;

    scene.rotation.y += VIEW_ROTATION_SPEED;

    gl.setRenderTarget(null);
    gl.render(scene, camera);

    if (recording && !isFinished.current && renderTarget.current) {
      if (framesRef.current.length < MAX_FRAMES) {
        frameCounter.current++;

        if (frameCounter.current % FRAME_SKIP === 0) {
          const rt = renderTarget.current;

          let originalAspect = 0;
          const isPerspective = (camera as any).isPerspectiveCamera;

          if (isPerspective) {
            const pCamera = camera as PerspectiveCamera;
            originalAspect = pCamera.aspect;
            pCamera.aspect = GIF_WIDTH / GIF_HEIGHT;
            pCamera.zoom = 2;
            pCamera.updateProjectionMatrix();
          }

          const originalRotation = scene.rotation.y;
          const direction = Math.sign(VIEW_ROTATION_SPEED);
          gifRotationOffset.current += GIF_ADDITIONAL_ROTATION * direction;
          scene.rotation.y += gifRotationOffset.current;

          gl.setClearColor(0x000000, 0);
          gl.setRenderTarget(rt);
          gl.clear();
          gl.render(scene, camera);

          scene.rotation.y = originalRotation;

          const expoContext = gl.getContext() as ExpoWebGLRenderingContext;
          const pixels = new Uint8Array(GIF_WIDTH * GIF_HEIGHT * 4);

          expoContext.readPixels(
            0,
            0,
            GIF_WIDTH,
            GIF_HEIGHT,
            expoContext.RGBA,
            expoContext.UNSIGNED_BYTE,
            pixels,
          );

          gl.setRenderTarget(null);

          if (isPerspective) {
            const pCamera = camera as PerspectiveCamera;
            pCamera.aspect = originalAspect;
            pCamera.zoom = 1;
            pCamera.updateProjectionMatrix();
          }

          const flippedPixels = flipPixels(pixels, GIF_WIDTH, GIF_HEIGHT);
          framesRef.current.push(flippedPixels);
        }
      } else {
        isFinished.current = true;
        processGif();
        frameCounter.current = 0;
        gifRotationOffset.current = 0;
      }
    } else if (!recording) {
      gifRotationOffset.current = 0;
    }
  }, 1);

  const processGif = async () => {
    await InteractionManager.runAfterInteractions(async () => {
      try {
        const gif = GIFEncoder();

        for (let i = 0; i < framesRef.current.length; i++) {
          const frame = framesRef.current[i];
          const palette = quantize(frame, 256, { format: "rgba8888" });
          const index = applyPalette(frame, palette, { format: "rgba8888" });

          gif.writeFrame(index, GIF_WIDTH, GIF_HEIGHT, {
            palette,
            delay: 100,
            transparent: true,
            transparentIndex: 0,
          });

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        gif.finish();
        const output = gif.bytes();

        if (Platform.OS === "web") {
          const blob = new Blob([output], { type: "image/gif" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `model-${Date.now()}.gif`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          onFinished();
        } else {
          const base64Gif = Buffer.from(output).toString("base64");
          const filename = `${FileSystem.cacheDirectory}model-${Date.now()}.gif`;

          await FileSystem.writeAsStringAsync(filename, base64Gif, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const permission = await MediaLibrary.requestPermissionsAsync();

          if (permission.granted) {
            try {
              await MediaLibrary.createAssetAsync(filename);
              Alert.alert("Sucesso", "GIF salvo na galeria!");

              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filename, {
                  mimeType: "image/gif",
                  dialogTitle: "Compartilhar Modelo",
                  UTI: "com.compuserve.gif",
                });
              }
            } catch (e) {
              console.error(e);
              Alert.alert("Erro", "Falha ao salvar na galeria.");
            }
          }
          onFinished();
        }
      } catch (err) {
        console.error("Erro na geração do GIF:", err);
        Alert.alert("Erro", "Falha ao gerar o GIF.");
      } finally {
        framesRef.current = [];
        isFinished.current = false;
      }
    });
  };

  return null;
};

function flipPixels(pixels: Uint8Array, width: number, height: number) {
  const halfHeight = Math.floor(height / 2);
  const rowBytes = width * 4;
  const tempRow = new Uint8Array(rowBytes);

  for (let y = 0; y < halfHeight; y++) {
    const topOffset = y * rowBytes;
    const bottomOffset = (height - 1 - y) * rowBytes;
    tempRow.set(pixels.subarray(topOffset, topOffset + rowBytes));
    pixels.copyWithin(topOffset, bottomOffset, bottomOffset + rowBytes);
    pixels.set(tempRow, bottomOffset);
  }
  return pixels;
}
