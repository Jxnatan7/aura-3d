import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useModelStore } from "@/stores/modelStore";
import { processImage } from "@/utils/imageProcessor";
import { useRewardedAd } from "@/hooks/useRewardedAd";
import useGenerateModel3D from "../useGenerateModel3D";

export function useCreateModelLogic() {
  const { push } = useRouter();
  const { showAd, isLoaded } = useRewardedAd();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(
    null,
  );
  const [name, setName] = useState<string | null>("");

  const { mutateAsync } = useGenerateModel3D();
  const { setModelId, setIsGenerating, setModelName } = useModelStore();
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
    if (!permission.granted)
      return Alert.alert("Permissão", "Acesso necessário.");
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
    if (!permission.granted)
      return Alert.alert("Permissão", "Acesso necessário.");
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    await handleImageResult(result);
  };

  const showImageOptions = () => {
    Alert.alert("Adicionar imagem", "Escolha uma opção:", [
      { text: "Tirar Foto", onPress: takePhoto },
      { text: "Escolher da Galeria", onPress: pickImageFromGallery },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const callApiToGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await mutateAsync({
        name: name!,
        imageBase64: selectedImageBase64!,
      });
      setModelId(res._id);
      setModelName(res.name);
      push({
        pathname: "/model-preview",
        params: { id: res._id, name: res.name },
      });
    } catch (error) {
      setIsGenerating(false);
      Alert.alert("Erro", "Não foi possível gerar o modelo.");
    }
  };

  const handleGeneratePress = async () => {
    if (!selectedImageBase64 || !name) {
      Alert.alert("Erro", "Imagem ou nome não preenchidos.");
      return;
    }

    Alert.alert(
      "Gerar Modelo 3D",
      "Para gerar este modelo de alta qualidade, você precisa assistir a um breve anúncio.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Assistir e Gerar",
          onPress: async () => {
            const userWatched = await showAd();
            if (userWatched) {
              await callApiToGenerate();
            }
          },
        },
      ],
    );
  };

  return {
    name,
    setName,
    selectedImage,
    showImageOptions,
    buttonText: isLoaded ? "Assistir Anúncio e Gerar" : "Carregando Anúncio...",
    handleGeneratePress,
    isAdLoaded: isLoaded,
    isButtonDisabled: !name || !selectedImageBase64 || !isLoaded,
  };
}
