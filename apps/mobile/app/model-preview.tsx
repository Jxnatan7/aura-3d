import React from "react";
import { Box, Text } from "@/src/components/restyle";
import { Container } from "@/src/components/layout/Container";
import { Model3DList } from "@/src/components/theme/Model3DList";
import { useRouter } from "expo-router";
import { ModelLoadingAnimation } from "@/src/components/theme/ModelLoadingAnimation";

export default function ModelPreview() {
  const router = useRouter();
  const goBack = () => router.push("/(tabs)");

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        backButtonCallback: goBack,
      }}
    >
      <Box
        flex={1}
        width="100%"
        height="100%"
        mt="xl"
        justifyContent="space-between"
        paddingHorizontal="m"
      >
        <Box flex={1} alignItems="center">
          <ModelLoadingAnimation />
        </Box>

        <Box mb="xl" width="100%">
          <Text variant="infoTitle" alignSelf="flex-start">
            Enquanto isso, explore nossos modelos:
          </Text>
          <Model3DList listType="ALL" horizontal />
        </Box>
      </Box>
    </Container>
  );
}
