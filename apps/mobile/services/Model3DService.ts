import axiosClient from "@/api/axiosClient";

export type Create3DGenerationDto = {
  name: string;
  imageBase64: string;
  modelType?: "standard" | "lowpoly";
};

export type TextureMaps = {
  baseColor?: string;
  metallic?: string;
  normal?: string;
  roughness?: string;
};

export type TaskError = {
  message?: string;
};

export type ModelUrls = {
  glb?: string;
  fbx?: string;
  obj?: string;
  usdz?: string;
  preRemeshedGlb?: string;
};

export type MeshyStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED";

export type Model3D = {
  _id?: string;
  name: string;
  externalId: string;
  status: MeshyStatus;
  type?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  texturePrompt?: string;
  modelUrls?: ModelUrls;
  textureUrls?: TextureMaps[];
  progress?: number;
  precedingTasks?: number;
  taskError?: TaskError;
  startedAt?: number;
  externalCreatedAt?: number;
  expiresAt?: number;
  finishedAt?: number;
  userId?: string;
  rawMetadata?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isStoredLocally?: boolean;
};

export type FilterRequest = {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: string;
  from?: string;
  to?: string;
};

const Model3DService = {
  async generate(request: Create3DGenerationDto) {
    const { data } = await axiosClient.post("/3d-generation/", request);
    return data;
  },
  async search(filterRequest: FilterRequest) {
    return axiosClient.post(`/3d-generation/search`, filterRequest);
  },
  async processImage(id: string) {
    return axiosClient.post(`/webhooks/meshy/test/${id}`, {
      baseURL: "http://localhost:3001",
    });
  },
};

export default Model3DService;
