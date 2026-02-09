import React, { useState } from "react";
import { StyleSheet, Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { Container } from "@/components/theme/Container";
import { Image } from "@/components/theme/Image";
import { Box } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { useRouter } from "expo-router";
import { TextInput } from "@/components/theme/TextInput";
import useGenerateModel3D from "@/hooks/useGenerateModel3D";
import { useModelStore } from "@/stores/modelStore";
import { useRewardedAd } from "@/hooks/useRewardedAd";

export default function CreateModel() {
  const { push } = useRouter();
  const { showAd, isLoaded } = useRewardedAd();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(
    null,
  );

  const [name, setName] = useState<string | null>();
  const { mutateAsync } = useGenerateModel3D();
  const { setModelId, setIsGenerating, setModelName } = useModelStore();

  const callApiToGenerate = async () => {
    if (!selectedImageBase64 || !name) return;

    try {
      setIsGenerating(true);

      const res = await mutateAsync({
        name: name || "Modelo",
        imageBase64: selectedImageBase64,
      });

      setModelId(res._id);
      setModelName(res.name);

      push({
        pathname: "/model-preview",
        params: {
          id: res._id,
          name: res.name,
        },
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

  const processImage = async (uri: string) => {
    try {
      const context = ImageManipulator.manipulate(uri);

      context.resize({ width: 600 });

      const imageRef = await context.renderAsync();

      const result = await imageRef.saveAsync({
        base64: true,
        compress: 0.7,
        format: SaveFormat.JPEG,
      });

      if (context.release) context.release();
      if (imageRef.release) imageRef.release();

      return result;
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      Alert.alert("Erro", "Falha ao processar a imagem.");
      return null;
    }
  };

  const generateModel = async () => {
    if (!selectedImageBase64 || !name) {
      Alert.alert("Erro", "Imagem ou nome não preenchidos.");
      return;
    }

    const res = await mutateAsync({
      name: name || "Modelo",
      imageBase64: selectedImageBase64,
    });

    setIsGenerating(true);
    setModelId(res._id);
    setModelName(res.name);

    push({
      pathname: "/model-preview",
      params: {
        id: res._id,
        name: res.name,
      },
    });
  };

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      const processed = await processImage(result.assets[0].uri);
      console.log("🚀 ~ takePhoto ~ processed:", processed?.base64?.length);

      if (processed) {
        setSelectedImage(processed.uri);
        setSelectedImageBase64(processed.base64 || null);
      }
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      const processed = await processImage(result.assets[0].uri);
      console.log("🚀 ~ takePhoto ~ processed:", processed?.base64?.length);

      if (processed) {
        setSelectedImage(processed.uri);
        setSelectedImageBase64(processed.base64 || null);
      }
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Tirar Foto", "Escolher da Galeria", "Cancelar"],
          cancelButtonIndex: 2,
        },
        (buttonIndex: number) => {
          if (buttonIndex === 0) {
            takePhoto();
          } else if (buttonIndex === 1) {
            pickImageFromGallery();
          }
        },
      );
    } else {
      Alert.alert("Adicionar imagem", "Escolha uma opção:", [
        { text: "Tirar Foto", onPress: takePhoto },
        { text: "Escolher da Galeria", onPress: pickImageFromGallery },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        title: "Criar Modelo",
        titleProps: {},
      }}
      style={styles.contentContainer}
    >
      <Box style={styles.imageContainer}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            width={300}
            height={300}
            contentFit="cover"
            style={{ borderRadius: 10 }}
          />
        ) : (
          <Box style={styles.placeholder} />
        )}
      </Box>

      {selectedImage && (
        <Box style={styles.inputContainer}>
          <TextInput
            placeholder="Nome do Modelo"
            value={name ? name : undefined}
            onEndEditing={(event) => setName(event.nativeEvent.text)}
          />
        </Box>
      )}

      <Box style={styles.buttonContainer}>
        {selectedImage && (
          <Button
            text={
              Platform.OS === "web"
                ? "Gerar Modelo"
                : isLoaded
                  ? "Assistir Anúncio e Gerar"
                  : "Carregando Anúncio..."
            }
            variant="success"
            onPress={handleGeneratePress}
            textProps={{ fontWeight: "bold" }}
            style={{
              opacity: name && (isLoaded || Platform.OS === "web") ? 1 : 0.5,
            }}
            disabled={!name || (!isLoaded && Platform.OS !== "web")}
          />
        )}

        <Button
          text={selectedImage ? "Alterar imagem" : "Adicionar imagem"}
          onPress={showImageOptions}
        />
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
  },
  placeholder: {
    width: 300,
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    gap: 10,
  },
});
