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
    <Box alignItems="center" width="100%">
      <Box style={styles.imageContainer}>
        <Image
          source={{ uri: selectedImage! }}
          width="100%"
          height="100%"
          contentFit="cover"
          paddingBottom="l"
        />
        <LinearGradient
          colors={["#080808ff", "rgba(8, 8, 8, 0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradient}
        />
      </Box>

      <Box width="100%" padding="m">
        <TextInput
          placeholder="Nome do Modelo"
          value={name ? name : undefined}
          onEndEditing={(event) => {
            setName(event.nativeEvent.text);
          }}
          placeholderTextColor="#FFF"
          containerProps={{
            backgroundColor: "transparent",
            borderBottomWidth: 2,
            borderBottomColor: "blue300",
            marginBottom: "m",
          }}
          backgroundColor="transparent"
          color="white"
          style={{ fontFamily: "MulishFontSemiBold" }}
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
          borderRadius={10}
          maxWidth={500}
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
          icon={<MaterialCommunityIcons name="image" size={24} color="black" />}
          width="100%"
          onPress={reset}
          flexDirection="row-reverse"
          gap="m"
          borderRadius={10}
          maxWidth={500}
          backgroundColor="yellow100"
          text="Escolher outra imagem"
          textProps={{
            color: "extraBlack",
            fontFamily: "MulishFontBold",
            fontSize: 18,
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
    width: "100%",
    height: 500,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    zIndex: 1,
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
