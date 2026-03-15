import React, { useCallback } from "react";
import {
  PaginatedFlashList,
  PaginatedFlashListProps,
  PaginatedResult,
} from "../PaginatedFlashList";
import Model3DService, { Model3D } from "@/services/Model3DService";
import { useRouter } from "expo-router";
import { ModelItem } from "../ModelItem";
import { useModelListContext } from "@/contexts/ModelListContext";
import useLoginModal from "@/hooks/useLoginModal";
import { useLikeModel } from "@/hooks/useLikeModel";
import { useAuthStore } from "@/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";

export type Model3DListProps = Partial<PaginatedFlashListProps<Model3D>> & {
  listType?: "ALL" | "MY";
  search?: string;
};

const VerticalList = ({ ...props }: PaginatedFlashListProps<Model3D>) => {
  return (
    <PaginatedFlashList<Model3D>
      variant="models-vertical"
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
      }}
      {...props}
    />
  );
};

const HorizontalList = ({ ...props }: PaginatedFlashListProps<Model3D>) => {
  return (
    <PaginatedFlashList<Model3D>
      variant="models-horizontal"
      {...props}
      horizontal
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled={true}
      alwaysBounceVertical={false}
      overScrollMode="never"
      contentContainerStyle={{
        backgroundColor: "transparent",
        gap: 10,
      }}
    />
  );
};

const List = ({ horizontal, ...props }: PaginatedFlashListProps<Model3D>) => {
  return (horizontal ? HorizontalList : VerticalList)({ ...props });
};

export const Model3DList = ({
  listType = "ALL",
  search,
  horizontal,
  ...props
}: Model3DListProps) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { push } = useRouter();
  const { setModels } = useModelListContext();
  const { showModal, LoginAlertComponent } = useLoginModal(
    "Para curtir um modelo, você precisa fazer login.",
  );
  const { handleLikeModel } = useLikeModel();

  const fetchRequests = useCallback(
    async (
      page: number,
      pageSize: number,
    ): Promise<PaginatedResult<Model3D> | undefined> => {
      const filters = {
        q: search,
        page,
        pageSize,
        userId: listType === "MY" && user ? user.id : undefined,
      };

      const response = await queryClient.fetchQuery({
        queryKey: ["models", filters],
        queryFn: () => Model3DService.search(filters),
        staleTime: 1000 * 60 * 5,
      });

      return response.data;
    },
    [search, listType, user, queryClient],
  );

  const handleModelPress = useCallback(
    (item: Model3D, glbUrl?: string) => {
      push({
        pathname: "/model-view",
        params: {
          id: item.id,
          glb: glbUrl,
          name: item.name,
          imageUrl: item.thumbnailUrl ?? item.imageUrl,
        },
      });
    },
    [push],
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <ModelItem
        item={item}
        index={index}
        onPress={handleModelPress}
        horizontal={horizontal}
        onLike={() => {
          handleLikeModel(item, isAuthenticated, showModal);
        }}
      />
    ),
    [handleModelPress, isAuthenticated, showModal, handleLikeModel, horizontal],
  );

  return (
    <>
      <List
        {...props}
        style={{ backgroundColor: "transparent" }}
        onDataChange={setModels}
        renderItem={renderItem}
        fetchData={fetchRequests}
        pageSize={10}
        horizontal={horizontal}
        numColumns={horizontal ? undefined : 2}
        showsVerticalScrollIndicator={false}
      />
      <LoginAlertComponent />
    </>
  );
};
