import React, { useState } from "react";
import { Dimensions } from "react-native";
import { RestyleContainer } from "@/components/restyle/Container";
import { Box, Text } from "@/components/restyle";
import { RestyleCard } from "@/components/restyle/Card";
import { IconButton } from "@/components/theme/IconButton";
import { MaterialIcons } from "@expo/vector-icons";
import { ModelImage } from "@/components/theme/ModelImage";
import { useRouter } from "expo-router";
import { useAuthActions, useUser } from "@/contexts/AuthProvider";
import { ActionModal } from "@/components/theme/ActionModal";
import { Model3DList } from "@/components/theme/Model3DList";
import { Model3D } from "@/services/Model3DService";
import { useModelStore } from "@/stores/modelStore";
import { SearchInput } from "@/components/theme/SearchInput";
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
  const user = useUser();
  const { logout } = useAuthActions();
  const { push } = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const { isGenerating } = useModelStore();

  const renderItem = ({ item, index }: any) => (
    <ModelItem item={item} index={index} />
  );

  return (
    <RestyleContainer variant="screen" paddingHorizontal="m">
      <RestyleCard
        variant="header"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="l"
      >
        <Box alignItems="flex-start" flexDirection="row">
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
        <IconButton
          onPress={() => (user ? setOpenModal(true) : push("/login"))}
          icon={
            <Box
              width={32}
              height={32}
              borderRadius={10}
              backgroundColor="blue300"
              alignItems="center"
              justifyContent="center"
              marginLeft="s"
            >
              <MaterialIcons name="person" size={20} color="#fff" />
            </Box>
          }
        />
      </RestyleCard>
      <SearchInput
        placeholderTextColor="#FFF"
        containerProps={{
          backgroundColor: "transparent",
          borderBottomWidth: 2,
          borderBottomColor: "blue300",
          marginBottom: "l",
        }}
        backgroundColor="transparent"
        iconContainerStyle={{ backgroundColor: "transparent", paddingLeft: 0 }}
        iconProps={{ color: "#3DCDF3" }}
        color="white"
        style={{ fontFamily: "MulishFontSemiBold" }}
        placeholder="Busque por um modelo"
      />
      <Text
        variant="subHeader"
        fontSize={18}
        color="mainText"
        alignSelf="flex-start"
        mt="s"
        mb="m"
        fontFamily="MulishFontSemiBold"
      >
        Recent Models
      </Text>

      <Model3DList
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
      <IconButton
        variant="createModel"
        icon={<MaterialIcons name="add" size={50} color="#ffffff" />}
        // onPress={() => push("/model-preview")}
        onPress={() => push(isGenerating ? "/model-preview" : "/create-model")}
      />
    </RestyleContainer>
  );
}
