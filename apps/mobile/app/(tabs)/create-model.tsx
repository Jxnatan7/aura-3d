import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, Switch, TextInput as RNTextInput } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import { LiquidGlassView } from "@/components/theme/LiquidGlassView";

export default function CreateModel() {
  const theme = useTheme<Theme>();
  const { isAuthenticated } = useAuthStore();
  const { isGenerating } = useModelContext();
  const inputRef = useRef<RNTextInput>(null);

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
    handleGeneratePress();
  }, [handleGeneratePress]);

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
        fontFamily="MulishFont"
        color="gray300"
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
          // onPress={() => push("/model-preview")}
          onPress={pickImageFromGallery}
          icon={
            <Box borderColor="blue300" marginBottom="s">
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
            <Box borderColor="blue300" marginBottom="s">
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
    <Box alignItems="center" width="100%" flex={1}>
      <Box style={styles.imageContainer}>
        <Image
          source={{ uri: selectedImage! }}
          width="100%"
          height="100%"
          contentFit="cover"
          paddingBottom="l"
          borderRadius={16}
        />
        <LinearGradient
          colors={["#1A1A2E", "rgba(8, 8, 8, 0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradient}
        />
      </Box>

      <Box width="95%" marginTop="xl" padding="m" borderRadius={16}>
        <LiquidGlassView style={StyleSheet.absoluteFill} />

        <TextInput
          placeholder="Nome do Modelo"
          value={name ? name : undefined}
          onEndEditing={(event) => {
            setName(event.nativeEvent.text);
          }}
          placeholderTextColor="#FFF"
          backgroundColor="transparent"
          color="white"
          style={{ fontFamily: "Sekuya-Regular", fontSize: 24, padding: 0 }}
          containerProps={{
            style: {
              borderBottomWidth: 1,
              borderBottomColor: "#FFF",
            },
          }}
        />

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
          marginBottom="m"
          onPress={onGenerate}
          disabled={isButtonDisabled}
          flexDirection="row-reverse"
          gap="m"
          maxWidth={500}
          text="Gerar Modelo 3D"
          textProps={{
            color: "black",
            fontFamily: "MulishFontBold",
            fontSize: 18,
          }}
          style={{ opacity: isButtonDisabled ? 0.7 : 1 }}
          glassProps={{
            tint: "light",
            intensity: 50,
          }}
        />

        <IconButton
          icon={<MaterialCommunityIcons name="image" size={24} color="black" />}
          width="100%"
          onPress={reset}
          flexDirection="row-reverse"
          gap="m"
          maxWidth={500}
          backgroundColor="yellow100"
          text="Escolher outra imagem"
          textProps={{
            color: "extraBlack",
            fontFamily: "MulishFontBold",
            fontSize: 18,
          }}
          glassProps={{
            intensity: 50,
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Container
      variant="screen"
      style={[
        styles.contentContainer,
        selectedImage
          ? { justifyContent: "flex-start" }
          : { justifyContent: "center" },
      ]}
      hideHeader
    >
      {selectedImage ? renderFormState() : renderEmptyState()}
    </Container>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
  },
  imageContainer: {
    width: "95%",
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    zIndex: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 500,
    marginBottom: 20,
    marginTop: 20,
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
