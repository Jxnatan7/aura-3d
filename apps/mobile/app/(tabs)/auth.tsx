import React from "react";
import { Container } from "@/components/theme/Container";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { UserProfileView } from "@/components/theme/UserProfileView";
import { LoginView } from "@/components/theme/LoginView";
import { LogoutButton } from "@/components/theme/LogoutButton";

export default function AuthScreen() {
  const { request, promptAsync, isAuthenticated, user } = useGoogleAuth();

  return (
    <Container
      variant="screen"
      justifyContent="flex-start"
      paddingHorizontal="m"
      containerHeaderChildren={isAuthenticated ? <LogoutButton /> : null}
      containerHeaderProps={{
        hideBackButton: true,
        justifyContent: "flex-end",
      }}
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
