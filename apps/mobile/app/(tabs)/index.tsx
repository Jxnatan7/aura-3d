import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { Box, Text } from "@/components/restyle";
import { RestyleCard } from "@/components/restyle/Card";
import Button from "@/components/theme/Button";
import { useAuthStore } from "@/stores/authStore";
import { useAuthActions } from "@/contexts/AuthProvider";
import useLoginModal from "@/hooks/useLoginModal";
import { usePreventGoBack } from "@/hooks/usePreventGoBack";
import { SCREEN_WIDTH } from "@/constants";
import { Container } from "@/components/theme/Container";
import { Model3DList } from "@/components/theme/Model3DList";

export type ListType = "ALL" | "MY";

export default function DashboardScreen() {
  const { push } = useRouter();
  const { logout } = useAuthActions();
  const { isAuthenticated } = useAuthStore();
  usePreventGoBack(true);

  const { showModal, LoginAlertComponent } = useLoginModal(
    "Para ver seus modelos, você precisa estar logado.",
  );

  const handleLogout = useCallback(() => {
    logout();
    push("/(tabs)/auth");
  }, [logout, push]);

  const handleTabChange = useCallback(() => {
    if (!isAuthenticated) {
      showModal();
      return;
    }
    push("/(tabs)/auth");
  }, [isAuthenticated, showModal]);

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);

  return (
    <Container variant="screen" paddingHorizontal="m" hideHeader>
      <RestyleCard
        variant="header"
        width={SCREEN_WIDTH}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box alignItems="center" flexDirection="row" padding="m">
          <Text
            variant="header"
            fontSize={20}
            color="mainText"
            fontFamily="Sekuya-Regular"
          >
            Aura
          </Text>
          <Text
            variant="header"
            fontSize={20}
            color="blue300"
            fontFamily="Sekuya-Regular"
          >
            3D
          </Text>
        </Box>
      </RestyleCard>
      <Box
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        gap="m"
        backgroundColor="transparent"
      >
        <Button
          variant={"chipActive"}
          // onPress={() => handleTabChange("ALL")}
          onPress={handleLogout}
          text="Recentes"
          textProps={{
            fontSize: 16,
            color: "white",
          }}
        />
        <Button
          variant={isAuthenticated ? "chipActive" : "chipDisabled"}
          onPress={handleTabChange}
          text="Meus Modelos"
          textProps={{
            fontSize: 16,
            color: "white",
          }}
        />
      </Box>

      <Model3DList keyExtractor={keyExtractor} />
      <LoginAlertComponent />
    </Container>
  );
}
