import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { Box, Text } from "@/components/restyle";
import { RestyleCard } from "@/components/restyle/Card";
import Button from "@/components/theme/Button";
import { useAuthStore } from "@/stores/authStore";
import { useAuthActions } from "@/contexts/AuthProvider";
import useLoginModal from "@/hooks/useLoginModal";
import { Model3DList } from "@/components/theme/Model3DList";
import { usePreventGoBack } from "@/hooks/usePreventGoBack";
import { SCREEN_WIDTH } from "@/constants";
import { Container } from "@/components/theme/Container";

export type ListType = "ALL" | "MY";

export default function DashboardScreen() {
  const { push } = useRouter();
  const { logout } = useAuthActions();
  const { isAuthenticated } = useAuthStore();
  usePreventGoBack(true);

  const { showModal } = useLoginModal(
    "Para ver seus modelos, você precisa estar logado.",
  );

  const [listType, setListType] = useState<ListType>("ALL");

  const handleLogout = useCallback(() => {
    logout();
    push("/login");
  }, [logout, push]);

  const handleTabChange = useCallback(
    (type: ListType) => {
      if (type === "MY" && !isAuthenticated) {
        showModal();
        return;
      }
      setListType(type);
    },
    [isAuthenticated, showModal],
  );

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);

  const listTitle = useMemo(
    () => (listType === "ALL" ? "Recentes" : "Meus Modelos"),
    [listType],
  );

  return (
    <Container variant="screen" paddingHorizontal="m" hideHeader>
      <RestyleCard
        variant="header"
        width={SCREEN_WIDTH}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={{
          shadowColor: "#272727",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
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
        marginBottom="m"
        backgroundColor="transparent"
      >
        <Button
          variant={listType === "ALL" ? "chipActive" : "chip"}
          // onPress={() => handleTabChange("ALL")}
          onPress={handleLogout}
          text="Recentes"
          textProps={{
            fontSize: 16,
            color: listType === "ALL" ? "white" : "mainText",
          }}
        />
        <Button
          variant={
            isAuthenticated
              ? listType === "MY"
                ? "chipActive"
                : "chip"
              : "chipDisabled"
          }
          onPress={() => handleTabChange("MY")}
          text="Meus Modelos"
          textProps={{
            fontSize: 16,
            color: listType === "MY" ? "white" : "mainText",
          }}
        />
      </Box>

      <Model3DList listType={listType} keyExtractor={keyExtractor} />
    </Container>
  );
}
