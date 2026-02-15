import React, { useState, useCallback } from "react";
import { StyleSheet, Switch } from "react-native";
import { Redirect } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Container } from "@/components/theme/Container";
import { Box, Text } from "@/components/restyle";
import { TextInput } from "@/components/theme/TextInput";
import { IconButton } from "@/components/theme/IconButton";
import { Image } from "@/components/theme/Image";
import { useCreateModel } from "@/hooks/useCreateModel";
import { useAuthStore } from "@/stores/authStore";
import { useModelContext } from "@/contexts/ModelContext";
import useLoginModal from "@/hooks/useLoginModal";
import { Theme } from "@/theme";

export default function CreateModel() {
  const theme = useTheme<Theme>();
  const { isAuthenticated } = useAuthStore();
  const { isGenerating } = useModelContext();

  const {
    name,
    setName,
    selectedImage,
    handleGeneratePress,
    isButtonDisabled,
    takePhoto,
    pickImageFromGallery,
    reset,
  } = useCreateModel();

  const { showModal } = useLoginModal(
    "Para criar um modelo público, você precisa estar logado.",
  );

  const [isPublic, setIsPublic] = useState(true);

  const handlePublicToggle = useCallback(
    (value: boolean) => {
      if (!isAuthenticated) {
        showModal();
        return;
      }
      setIsPublic(value);
    },
    [isAuthenticated, showModal],
  );

  const onGenerate = useCallback(() => {
    handleGeneratePress(reset);
  }, [handleGeneratePress, reset]);

  if (isGenerating) {
    return <Redirect href="/model-preview" />;
  }

  const renderEmptyState = () => (
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
        Faça upload de uma imagem {"\n"} para transformá-la em um modelo 3D
      </Text>

      <Box style={styles.buttonContainer}>
        <IconButton
          variant="imageOption"
          text="Enviar"
          onPress={pickImageFromGallery}
          icon={
            <Box borderColor="blue300">
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
            <Box borderColor="blue300">
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
    </>
  );

  const renderFormState = () => (
    <Box alignItems="center" width="100%">
      <Box style={styles.imageContainer}>
        <Image
          source={{ uri: selectedImage! }}
          width={300}
          height={300}
          contentFit="cover"
          style={styles.imageBorder}
        />
      </Box>

      <Box style={styles.inputContainer}>
        <TextInput
          placeholder="Nome do Modelo"
          value={name || ""}
          onChangeText={setName}
        />
      </Box>

      <Box
        style={styles.inputContainer}
        flexDirection="row"
        alignItems="center"
        gap="m"
      >
        <Switch value={isPublic} onValueChange={handlePublicToggle} />
        <Text variant="body">Público (visível para todos)</Text>
      </Box>

      <IconButton
        icon={
          <MaterialCommunityIcons name="creation" size={24} color="black" />
        }
        width="100%"
        marginBottom="s"
        onPress={onGenerate}
        disabled={isButtonDisabled}
        flexDirection="row-reverse"
        gap="m"
        borderRadius={10}
        maxWidth={300}
        backgroundColor="blue300"
        text="Gerar Modelo 3D"
        textProps={{
          color: "extraBlack",
          fontFamily: "MulishFontBold",
          fontSize: 18,
        }}
        style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
      />

      <IconButton
        icon={<MaterialCommunityIcons name="cancel" size={24} color="black" />}
        width="100%"
        onPress={reset}
        flexDirection="row-reverse"
        gap="m"
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
    </Box>
  );

  return (
    <Container variant="screen" style={styles.contentContainer} hideHeader>
      <Text variant="containerHeader" mt="xxxl" mb="xxxl" fontSize={20}>
        Novo Modelo
      </Text>

      {selectedImage ? renderFormState() : renderEmptyState()}
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
  imageBorder: {
    borderRadius: 10,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
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
