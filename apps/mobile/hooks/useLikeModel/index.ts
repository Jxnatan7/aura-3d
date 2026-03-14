import { useMutation, useQueryClient } from "@tanstack/react-query";
import Model3DService from "@/services/Model3DService";
import { Model3D } from "@/services/Model3DService";

export const useLikeModel = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (model: Model3D) => Model3DService.toggleLike(model.id ?? ""),
    mutationKey: ["toggle-like-model"],

    onMutate: async (model: Model3D) => {
      model.isLikedByMe = true;
    },
    onError: (err, model, context) => {
      model.isLikedByMe = false;
      console.error("Erro ao curtir modelo:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  const handleLikeModel = (
    model: Model3D,
    isAuthenticated: boolean,
    showModal: () => void,
  ) => {
    if (!isAuthenticated) {
      showModal();
      return;
    }
    mutate(model);
  };

  return {
    handleLikeModel,
    isLiking: isPending,
  };
};
