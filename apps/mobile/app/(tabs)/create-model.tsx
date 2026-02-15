import React, { useState } from "react";
import { Alert, StyleSheet, Switch } from "react-native";
import { Container } from "@/components/theme/Container";
import { Box, Text } from "@/components/restyle";
import { TextInput } from "@/components/theme/TextInput";

import { useCreateModel } from "@/hooks/useCreateModel";
import { IconButton } from "@/components/theme/IconButton";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";
import { Image } from "@/components/theme/Image";
import { useAuthStore } from "@/stores/authStore";
import { Redirect, useRouter } from "expo-router";
import { useModelContext } from "@/contexts/ModelContext";

export default function CreateModel() {
  const { isAuthenticated } = useAuthStore();
  const theme = useTheme<Theme>();
  const { push } = useRouter();
  const { isGenerating } = useModelContext();
  const {
    name,
    setName,
    selectedImage,
    showImageOptions,
    buttonText,
    handleGeneratePress,
    isButtonDisabled,
    takePhoto,
    pickImageFromGallery,
    reset,
  } = useCreateModel();

  const [isPublic, setIsPublic] = useState(true);

  const onChangePublicSwitch = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Fazer login",
        "Para criar um modelo público, vocé precisa estar logado.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Entrar",
            onPress: () => push("/login"),
          },
        ],
      );
      return;
    }
    setIsPublic((prev) => !prev);
  };

  if (isGenerating) {
    <Redirect href="/model-preview" />;
  }

  return (
    <Container variant="screen" style={styles.contentContainer}>
      <Text variant="containerHeader" mt="xxxl" mb="xxxl" fontSize={20}>
        Novo Modelo
      </Text>
      {!selectedImage && (
        <>
          <Text
            variant="containerHeader"
            mt="xxxl"
            fontSize={22}
            textAlign="center"
          >
            Tire uma foto ou {"\n"} escolha uma da galeria
          </Text>
          <Text
            fontFamily="MulishFontRegular"
            color="gray600"
            mt="m"
            fontSize={16}
            textAlign="center"
          >
            Faça upload de uma imagem {"\n"} para transformá la em um modelo 3D
          </Text>
        </>
      )}
      {selectedImage && (
        <Box style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage }}
            width={300}
            height={300}
            contentFit="cover"
            style={{ borderRadius: 10 }}
          />
        </Box>
      )}

      {selectedImage && (
        <Box style={styles.inputContainer}>
          <TextInput
            placeholder="Nome do Modelo"
            value={name || ""}
            onChangeText={setName}
          />
        </Box>
      )}

      {selectedImage && (
        <Box
          style={styles.inputContainer}
          flexDirection="row"
          alignItems={"center"}
          gap="m"
        >
          <Switch value={isPublic} onChange={onChangePublicSwitch} />
          <Text variant="body">Público (visível para todos)</Text>
        </Box>
      )}

      {selectedImage && (
        <IconButton
          icon={
            <MaterialCommunityIcons name="creation" size={24} color="black" />
          }
          width={"100%"}
          marginBottom="s"
          onPress={() => handleGeneratePress(reset)}
          disabled={isButtonDisabled}
          flexDirection="row-reverse"
          gap={"m"}
          borderRadius={10}
          maxWidth={300}
          backgroundColor="blue300"
          text="Gerar Modelo 3D"
          textProps={{
            color: "extraBlack",
            fontFamily: "MulishFontBold",
            fontSize: 18,
          }}
          style={{
            opacity: isButtonDisabled ? 0.5 : 1,
          }}
        />
      )}
      {selectedImage && (
        <IconButton
          icon={
            <MaterialCommunityIcons name="cancel" size={24} color="black" />
          }
          width={"100%"}
          onPress={reset}
          flexDirection="row-reverse"
          gap={"m"}
          borderRadius={10}
          maxWidth={300}
          backgroundColor="red100"
          text="Cancelar"
          textProps={{
            color: "extraBlack",
            fontFamily: "MulishFontBold",
            fontSize: 18,
          }}
        />
      )}

      {!selectedImage && (
        <Box style={styles.buttonContainer}>
          <IconButton
            variant="imageOption"
            text="Enviar"
            onPress={pickImageFromGallery}
            icon={
              <Box
                backgroundColor="transparent"
                alignItems="center"
                justifyContent="center"
                minWidth={60}
                minHeight={60}
                borderColor="blue300"
                borderRadius={10}
                mb="s"
              >
                <FontAwesome
                  name="photo"
                  size={40}
                  color={theme.colors.blue300}
                />
              </Box>
            }
            flexDirection="column-reverse"
          />

          <IconButton
            variant="imageOption"
            text="Tirar Foto"
            onPress={takePhoto}
            icon={
              <Box
                backgroundColor="transparent"
                alignItems="center"
                justifyContent="center"
                minWidth={60}
                minHeight={60}
                borderColor="blue300"
                borderRadius={10}
                mb="s"
              >
                <FontAwesome
                  name="camera"
                  size={40}
                  color={theme.colors.pink100}
                />
              </Box>
            }
            flexDirection="column-reverse"
          />
        </Box>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
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
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
