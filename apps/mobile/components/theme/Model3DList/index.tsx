import React, { useCallback } from "react";
import {
  PaginatedFlashList,
  PaginatedFlashListProps,
  PaginatedResult,
} from "../PaginatedFlashList";
import useModels3D from "@/hooks/useModels3D";
import { Model3D } from "@/services/Model3DService";
import { useRouter } from "expo-router";
import { ModelItem } from "../ModelItem";
import { useModelListContext } from "@/contexts/ModelListContext";

export type Model3DListProps = Partial<PaginatedFlashListProps<Model3D>> & {
  listType: "ALL" | "MY";
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
  listType,
  search,
  horizontal,
  ...props
}: Model3DListProps) => {
  const { push } = useRouter();
  const { mutateAsync } = useModels3D();
  const { setModels } = useModelListContext();

  const fetchRequests = useCallback(
    async (
      page: number,
      pageSize: number,
    ): Promise<PaginatedResult<Model3D> | undefined> => {
      const { data: response } = await mutateAsync({
        q: search,
        page,
        pageSize,
      });

      return response;
    },
    [mutateAsync, search],
  );

  const handleModelPress = useCallback(
    (item: Model3D, glbUrl?: string) => {
      push({
        pathname: "/model-view",
        params: {
          id: item._id,
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
      />
    ),
    [handleModelPress],
  );

  return (
    <List
      {...props}
      style={{
        backgroundColor: "transparent",
      }}
      onDataChange={setModels}
      renderItem={renderItem}
      fetchData={fetchRequests}
      pageSize={10}
      horizontal={horizontal}
      numColumns={horizontal ? undefined : 2}
      showsVerticalScrollIndicator={false}
    />
  );
};
