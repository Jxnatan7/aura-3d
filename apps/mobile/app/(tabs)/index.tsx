import React, { useState, useCallback, useMemo } from "react";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { RestyleContainer } from "@/components/restyle/Container";
import { Box, Text } from "@/components/restyle";
import { RestyleCard } from "@/components/restyle/Card";
import { ModelImage } from "@/components/theme/ModelImage";
import Button from "@/components/theme/Button";
import { Model3D } from "@/services/Model3DService";
import { useAuthStore } from "@/stores/authStore";
import { useAuthActions } from "@/contexts/AuthProvider";
import useLoginModal from "@/hooks/useLoginModal";
import { Model3DList } from "@/components/theme/Model3DList";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 56) / 2;
const HOST = process.env.EXPO_PUBLIC_MEDIA_HOSTNAME || "";

type ListType = "ALL" | "MY";

const formatMediaUrl = (
  item: Model3D,
  type: "image" | "glb",
): string | undefined => {
  const needsHost =
    item.isStoredLocally && !item.modelUrls?.glb?.startsWith("https");

  if (type === "glb") {
    return needsHost ? `${HOST}${item.modelUrls?.glb}` : item.modelUrls?.glb;
  }

  const imageUrl = item.thumbnailUrl ?? item.imageUrl;
  return needsHost ? `${HOST}${imageUrl}` : imageUrl;
};

interface ModelItemProps {
  item: Model3D;
  index: number;
  onPress: (item: Model3D, glbUrl?: string) => void;
}

const ModelItem = React.memo(
  ({ item, index, onPress }: ModelItemProps) => {
    const glbUrl = formatMediaUrl(item, "glb");
    const imageUrl = formatMediaUrl(item, "image");

    return (
      <RestyleCard
        variant="model"
        width={CARD_WIDTH}
        height={CARD_WIDTH}
        marginTop={index % 2 === 0 ? "l" : "none"}
        marginBottom="minus"
      >
        <ModelImage
          uri={imageUrl ?? ""}
          motiProps={{
            onPress: () => onPress(item, glbUrl),
          }}
        />
      </RestyleCard>
    );
  },
  (prevProps, nextProps) => prevProps.item._id === nextProps.item._id,
);

export default function DashboardScreen() {
  const { push } = useRouter();
  const { logout } = useAuthActions();
  const { isAuthenticated } = useAuthStore();

  const { showModal } = useLoginModal(
    "Para ver seus modelos, você precisa estar logado.",
  );

  const [listType, setListType] = useState<ListType>("ALL");

  const handleLogout = useCallback(() => {
    logout();
    push("/login");
  }, [logout, push]);

  const handleModelPress = useCallback(
    (item: Model3D, glbUrl?: string) => {
      push({
        pathname: "/model-view",
        params: {
          id: item._id,
          glb: glbUrl,
          name: item.name,
        },
      });
    },
    [push],
  );

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

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <ModelItem item={item} index={index} onPress={handleModelPress} />
    ),
    [handleModelPress],
  );

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);

  const listTitle = useMemo(
    () => (listType === "ALL" ? "Recentes" : "Meus Modelos"),
    [listType],
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
          // onPress={() => handleTabChange("ALL")}
          onPress={handleLogout}
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
          onPress={() => handleTabChange("MY")}
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
        {listTitle}
      </Text>

      <Model3DList
        listType={listType}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </RestyleContainer>
  );
}
