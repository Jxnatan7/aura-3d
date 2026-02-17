import React from "react";
import { Box } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import ProgressRing from "@/components/theme/ProgressRing";
import ProgressBar from "@/components/theme/ProgressBar";
import { useModelPreviewLogic } from "@/hooks/useModelPreviewLogic";

export default function ModelPreview() {
  const { isLoading, displayProgress, displayName, displayId, goBack } =
    useModelPreviewLogic();

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
        alignItems="center"
        justifyContent="center"
        px="m"
      >
        <ProgressRing />
        <ProgressBar progress={displayProgress} />
      </Box>
    </Container>
  );
}
