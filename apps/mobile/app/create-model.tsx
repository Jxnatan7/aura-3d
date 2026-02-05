import React, { useState } from "react";
import { StyleSheet, Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
// IMPORTAÇÃO NOVA
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { Container } from "@/components/theme/Container";
import { Image } from "@/components/theme/Image";
import { Box } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { useRouter } from "expo-router";
import { TextInput } from "@/components/theme/TextInput";
import useGenerateModel3D from "@/hooks/useGenerateModel3D";
import { useModelStore } from "@/stores/modelStore";

export default function CreateModel() {
  const { push } = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(
    null,
  );

  const [name, setName] = useState<string | null>();
  const { mutateAsync } = useGenerateModel3D();
  const { setModelId, setIsGenerating, setModelName } = useModelStore();

  // --- NOVA FUNÇÃO DE PROCESSAMENTO (API ATUALIZADA) ---
  const processImage = async (uri: string) => {
    try {
      // 1. Cria o contexto de manipulação
      const context = ImageManipulator.manipulate(uri);

      // 2. Redimensiona (Limita largura a 1024px, altura ajusta proporcionalmente)
      // Isso reduz drasticamente o tamanho do arquivo
      context.resize({ width: 600 });

      // 3. Renderiza a imagem processada
      const imageRef = await context.renderAsync();

      // 4. Salva/Exporta com compressão e Base64
      const result = await imageRef.saveAsync({
        base64: true,
        compress: 0.7, // 0.7 é um bom equilíbrio entre qualidade e tamanho
        format: SaveFormat.JPEG, // JPEG é bem mais leve que PNG
      });

      // 5. Limpeza de memória (Crítico na nova API SharedObject)
      // Como context e imageRef são objetos nativos compartilhados,
      // precisamos liberá-los manualmente.
      /* @ts-ignore: Dependendo da versão do TS/Expo, o release pode não estar tipado, mas existe */
      if (context.release) context.release();
      /* @ts-ignore */
      if (imageRef.release) imageRef.release();

      return result;
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      Alert.alert("Erro", "Falha ao processar a imagem.");
      return null;
    }
  };
  // -----------------------------------------------------

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
      base64: false, // Não pedimos base64 aqui, geramos no processImage
    });

    if (!result.canceled && result.assets[0]) {
      // Processa a imagem antes de salvar no estado
      const processed = await processImage(result.assets[0].uri);
      console.log("🚀 ~ takePhoto ~ processed:", processed?.base64?.length);

      if (processed) {
        setSelectedImage(processed.uri); // Usa a URI da imagem comprimida
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
      quality: 1, // Pode deixar 1 aqui, controlamos a compressão no processImage
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      // Processa a imagem antes de salvar no estado
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
            text="Gerar Modelo 3D"
            variant="success"
            onPress={generateModel}
            textProps={{ fontWeight: "bold" }}
            style={{ opacity: name ? 1 : 0.5 }}
            disabled={!name}
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
