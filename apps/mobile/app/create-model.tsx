import React from "react";
import { StyleSheet } from "react-native";
import { Container } from "@/components/theme/Container";
import { Image } from "@/components/theme/Image";
import { Box } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { TextInput } from "@/components/theme/TextInput";

import { useCreateModel } from "@/hooks/useCreateModel";

export default function CreateModel() {
  const {
    name,
    setName,
    selectedImage,
    showImageOptions,
    buttonText,
    handleGeneratePress,
    isButtonDisabled,
  } = useCreateModel();

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
            value={name || ""}
            onChangeText={setName} // Simplificado
          />
        </Box>
      )}

      <Box style={styles.buttonContainer}>
        {selectedImage && (
          <Button
            text={buttonText}
            variant="success"
            onPress={handleGeneratePress}
            textProps={{ fontWeight: "bold" }}
            style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
            disabled={isButtonDisabled}
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
