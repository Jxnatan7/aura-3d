import React from "react";
import { Container } from "@/components/theme/Container";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { UserProfileView } from "@/components/theme/UserProfileView";
import { LoginView } from "@/components/theme/LoginView";

export default function AuthScreen() {
  const { request, promptAsync, isAuthenticated, user } = useGoogleAuth();

  return (
    <Container
      variant="screen"
      hideHeader
      justifyContent="flex-start"
      paddingHorizontal="m"
    >
      {isAuthenticated && user ? (
        <UserProfileView user={user} />
      ) : (
        <LoginView
          isRequestReady={!!request}
          onLoginPress={() => promptAsync()}
        />
      )}
    </Container>
  );
}
