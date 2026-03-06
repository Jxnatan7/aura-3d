import Model3DService, { FilterRequest } from "@/services/Model3DService";
import { useQuery } from "@tanstack/react-query";

const useModels3D = (filters: FilterRequest) => {
  return useQuery({
    queryKey: ["models", filters],
    queryFn: () => Model3DService.search(filters),
  });
};

export default useModels3D;
