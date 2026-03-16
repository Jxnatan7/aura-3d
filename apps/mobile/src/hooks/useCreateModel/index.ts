import { useCallback, useState } from "react";
import { Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useModelStore } from "@/src/stores/modelStore";
import { processImage } from "@/src/utils/imageProcessor";
import useGenerateModel3D from "../useGenerateModel3D";
import useLoginModal from "../useLoginModal";
import { useAuthStore } from "@/src/stores/authStore";

export function useCreateModel() {
  const { isAuthenticated } = useAuthStore();
  const { push } = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(
    null,
  );
  const [name, setName] = useState<string | null>("");

  const { mutateAsync } = useGenerateModel3D();
  const { setModelId, setIsGenerating, setModelName } = useModelStore();
  const { showModal, LoginAlertComponent } = useLoginModal(
    "Para criar um modelo, você precisa estar logado.",
  );

  const reset = () => {
    setSelectedImage(null);
    setSelectedImageBase64(null);
    setName(null);
  };

  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets[0]) {
      const processed = await processImage(result.assets[0].uri);
      if (processed) {
        setSelectedImage(processed.uri);
        setSelectedImageBase64(processed.base64 || null);
      }
    }
  };

  const pickImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    await handleImageResult(result);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    await handleImageResult(result);
  };

  const handlePickImage = useCallback(() => {
    if (!isAuthenticated) {
      showModal();
      return;
    }
    pickImageFromGallery();
  }, [isAuthenticated, showModal, pickImageFromGallery]);

  const handleTakePhoto = useCallback(() => {
    if (!isAuthenticated) {
      showModal();
      return;
    }
    takePhoto();
  }, [isAuthenticated, showModal, takePhoto]);

  const showImageOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Tirar Foto", "Escolher da Galeria", "Cancelar"],
          cancelButtonIndex: 2,
        },
        (idx) => {
          if (idx === 0) takePhoto();
          if (idx === 1) pickImageFromGallery();
        },
      );
    } else {
      pickImageFromGallery();
    }
  };

  const submitModel = async (onSuccess?: () => void) => {
    if (!selectedImageBase64 || !name) {
      Alert.alert("Erro", "Imagem ou nome não preenchidos.");
      return;
    }
    try {
      const res = await mutateAsync({
        name: name,
        imageBase64: selectedImageBase64,
      });
      if (!res) return;
      setIsGenerating(true);
      setModelId(res._id);
      setModelName(res.name);
      onSuccess && onSuccess();
      push({
        pathname: "/model-preview",
        params: { id: res._id, name: res.name },
      });
    } catch (error) {
      setIsGenerating(false);
      Alert.alert("Erro", "Não foi possível gerar o modelo.");
    }
  };

  return {
    name,
    setName,
    selectedImage,
    showImageOptions,
    buttonText: "Gerar Modelo",
    handleGeneratePress: submitModel,
    isAdLoaded: true,
    isButtonDisabled: !name || !selectedImageBase64,
    takePhoto: handleTakePhoto,
    pickImageFromGallery: handlePickImage,
    reset,
    LoginAlertComponent,
  };
}
