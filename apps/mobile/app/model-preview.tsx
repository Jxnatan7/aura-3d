import { Text } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import { useModelStore } from "@/stores/modelStore";

export default function ModelPreview() {
  const { modelId, modelName, isCompleted, isGenerating, error } =
    useModelStore();

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        title: "Modelo 3D",
        titleProps: {},
      }}
    >
      <Text>Model ID: {modelId}</Text>
      <Text>Model Name: {modelName}</Text>
      <Text> Is Completed: {isCompleted}</Text>
      <Text> Is Generating: {isGenerating}</Text>
      <Text>Error: {error}</Text>
    </Container>
  );
}
