import React from "react";
import { ActivityIndicator } from "react-native";
import { Box } from "@/src/components/restyle";

export const LoadingState = ({
  isLoading,
  message,
}: {
  isLoading: boolean;
  message: string;
}) => {
  if (!isLoading) return null;

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={30}
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size="large" color="#ffffff" />
      {/* <Text style={{ color: "white", marginTop: 10 }}>{message}</Text> */}
    </Box>
  );
};
