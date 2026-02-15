import React, { useState } from "react";
import { Dimensions } from "react-native";
import { RestyleContainer } from "@/components/restyle/Container";
import { Box, Text } from "@/components/restyle";
import { RestyleCard } from "@/components/restyle/Card";
import { ModelImage } from "@/components/theme/ModelImage";
import { useRouter } from "expo-router";
import { useAuthActions } from "@/contexts/AuthProvider";
import { ActionModal } from "@/components/theme/ActionModal";
import { Model3DList } from "@/components/theme/Model3DList";
import { Model3D } from "@/services/Model3DService";
import { useModelStore } from "@/stores/modelStore";
import Button from "@/components/theme/Button";
import { useAuthStore } from "@/stores/authStore";
import useLoginModal from "@/hooks/useLoginModal";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ModelItem = ({ item, index }: { item: Model3D; index: number }) => {
  const { push } = useRouter();
  const CARD_WIDTH = (SCREEN_WIDTH - 56) / 2;
  const host = process.env.EXPO_PUBLIC_MEDIA_HOSTNAME || "";
  const mediaNeedHost =
    item.isStoredLocally && !item.modelUrls?.glb?.startsWith("https");

  return (
    <RestyleCard
      key={item._id?.toString()}
      variant="model"
      width={CARD_WIDTH}
      height={CARD_WIDTH}
      marginTop={index % 2 === 0 ? "l" : "none"}
      marginBottom="minus"
    >
      <ModelImage
        motiProps={{
          onPress: () => {
            push({
              pathname: "/model-view",
              params: {
                id: item._id,
                glb: mediaNeedHost
                  ? `${host}${item.modelUrls?.glb}`
                  : item.modelUrls?.glb,
                name: item.name,
              },
            });
          },
        }}
        uri={
          mediaNeedHost
            ? `${host}${item.thumbnailUrl ?? item.imageUrl}`
            : (item.thumbnailUrl ?? item.imageUrl)
        }
      />
    </RestyleCard>
  );
};

export default function DashboardScreen() {
  const { isAuthenticated } = useAuthStore();
  const { logout } = useAuthActions();
  const { push } = useRouter();
  const { isGenerating } = useModelStore();
  const { showModal } = useLoginModal(
    "Para ver seus modelos, você precisa estar logado.",
  );
  const [openModal, setOpenModal] = useState(false);
  const [listType, setListType] = useState<"ALL" | "MY">("ALL");

  const renderItem = ({ item, index }: any) => (
    <ModelItem item={item} index={index} />
  );

  return (
    <RestyleContainer variant="screen" paddingHorizontal="m">
      <RestyleCard
        variant="header"
        width={SCREEN_WIDTH}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="m"
        borderBottomWidth={1}
        borderBottomColor="gray900"
      >
        <Box alignItems="flex-start" flexDirection="row" padding="m">
          <Text
            variant="header"
            fontSize={22}
            color="mainText"
            fontFamily="MulishFontBold"
          >
            Aura
          </Text>
          <Text
            variant="header"
            fontSize={22}
            color="blue300"
            fontFamily="MulishFontBold"
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
      >
        <Button
          variant={listType === "ALL" ? "chipActive" : "chip"}
          onPress={() => setListType("ALL")}
          text="Recentes"
          textProps={{
            fontSize: 16,
            color: listType === "ALL" ? "blue300" : "mainText",
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
          onPress={isAuthenticated ? () => setListType("MY") : showModal}
          text="Meus Modelos"
          textProps={{
            fontSize: 16,
            color: listType === "MY" ? "blue300" : "mainText",
          }}
        />
      </Box>

      <Text
        variant="subHeader"
        fontSize={18}
        color="mainText"
        alignSelf="flex-start"
        mt="m"
        mb="m"
        fontFamily="MulishFontSemiBold"
      >
        {listType === "ALL" ? "Recentes" : "Meus Modelos"}
      </Text>

      <Model3DList
        listType={listType}
        keyExtractor={(item: any) => item._id.toString()}
        renderItem={renderItem}
      />
      <ActionModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        title="Aura3D"
        description="Deseja realmente encerrar a sessão?"
        onConfirm={() => {
          logout();
          setOpenModal(false);
          push("/login");
        }}
        confirmText="Sair da conta"
      />
    </RestyleContainer>
  );
}
