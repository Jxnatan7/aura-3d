import { Alert } from "react-native";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export const processImage = async (uri: string) => {
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
