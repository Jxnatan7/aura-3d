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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ModelItem = ({ item, index }: { item: Model3D; index: number }) => {
  const { push } = useRouter();
  const CARD_WIDTH = (SCREEN_WIDTH - 56) / 2;

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
                glb: item.modelUrls?.glb,
                name: item.name,
              },
            });
          },
        }}
        uri={item.thumbnailUrl || item.imageUrl}
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
    <RestyleContainer
      variant="screen"
      flex={1}
      backgroundColor="mainBackground"
    >
      <RestyleCard
        variant="header"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="m"
        paddingHorizontal="m"
      >
        <Box alignItems="flex-start">
          <Text
            variant="header"
            fontSize={22}
            fontWeight="bold"
            color="mainText"
          >
            Aura3D
          </Text>
          <Text variant="body" fontSize={12} color="gray100">
            Create 3D Models
          </Text>
        </Box>
        <IconButton
          onPress={() => (user ? setOpenModal(true) : push("/login"))}
          icon={
            <Box
              width={32}
              height={32}
              borderRadius={10}
              backgroundColor="yellow900"
              alignItems="center"
              justifyContent="center"
              marginLeft="s"
            >
              <MaterialIcons name="person" size={20} color="#fff" />
            </Box>
          }
        />
      </RestyleCard>
      <Box flexDirection="row" justifyContent="flex-start" width="100%" mt="l">
        <Text variant="subHeader" fontWeight="bold" color="gray100">
          6{" "}
        </Text>
        <Text variant="body" color="gray100">
          Models
        </Text>
      </Box>
      <Text
        variant="subHeader"
        fontSize={18}
        fontWeight="bold"
        color="mainText"
        alignSelf="center"
        paddingBottom="m"
      >
        Recent Creations
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
        onPress={() => push(isGenerating ? "/model-preview" : "/create-model")}
      />
    </RestyleContainer>
  );
}
