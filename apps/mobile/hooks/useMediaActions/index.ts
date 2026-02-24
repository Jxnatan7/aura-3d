import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export const useMediaActions = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const handleDownload = async (
    url: string,
    name: string,
    extension: string,
  ) => {
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

  return {
    isRecording,
    setIsRecording,
    isDownloading,
    showDownloadModal,
    setShowDownloadModal,
    handleDownload,
    handleRecord,
  };
};
