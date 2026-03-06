import { CreateImageTo3DRequest, MeshyTaskResponse } from "./meshy-types";

export interface IAIProvider {
  createImageTo3D(data: CreateImageTo3DRequest): Promise<{ result: string }>;
  getModelStatus(taskId: string): Promise<MeshyTaskResponse>;
  deleteTask(taskId: string): Promise<void>;
}
