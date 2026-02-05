import Model3DService, {
  Create3DGenerationDto,
} from "@/services/Model3DService";
import { useMutation } from "@tanstack/react-query";

const useGenerateModel3D = function (onSuccess: () => void = () => {}) {
  const { data, isSuccess, isPending, error, mutate, mutateAsync } =
    useMutation({
      mutationFn: (payload: Create3DGenerationDto) =>
        Model3DService.generate(payload),
      mutationKey: ["create-model-3d"],
      onSuccess,
    });

  return { data, isSuccess, isPending, error, mutate, mutateAsync };
};

export default useGenerateModel3D;
