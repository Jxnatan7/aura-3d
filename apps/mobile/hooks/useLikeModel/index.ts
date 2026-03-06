import { useMutation, useQueryClient } from "@tanstack/react-query";
import Model3DService from "@/services/Model3DService";
import { Model3D } from "@/services/Model3DService";

export const useLikeModel = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (modelId: string) => Model3DService.toggleLike(modelId),
    mutationKey: ["toggle-like-model"],

    onMutate: async (modelId: string) => {
      await queryClient.cancelQueries({ queryKey: ["models"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["models"],
      });

      queryClient.setQueriesData({ queryKey: ["models"] }, (oldData: any) => {
        if (!oldData) return oldData;

        const updateItem = (item: Model3D) => {
          if (item.id === modelId) {
            const isNowLiked = !item.isLikedByMe;
            return {
              ...item,
              isLikedByMe: isNowLiked,
              likesCount: isNowLiked
                ? (item.likesCount || 0) + 1
                : Math.max((item.likesCount || 0) - 1, 0),
            };
          }
          return item;
        };

        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items:
                  page.data?.items?.map(updateItem) ||
                  page.items?.map(updateItem),
              },
            })),
          };
        }

        if (oldData?.data?.items) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map(updateItem),
            },
          };
        }

        if (Array.isArray(oldData)) {
          return oldData.map(updateItem);
        }

        return oldData;
      });

      return { previousQueries };
    },

    onError: (err, modelId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      console.error("Erro ao curtir modelo:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  const handleLikeModel = (
    modelId: string,
    isAuthenticated: boolean,
    showModal: () => void,
  ) => {
    if (!isAuthenticated) {
      showModal();
      return;
    }
    mutate(modelId);
  };

  return {
    handleLikeModel,
    isLiking: isPending,
  };
};
