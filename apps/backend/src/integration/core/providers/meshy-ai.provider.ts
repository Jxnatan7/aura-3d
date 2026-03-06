import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { BaseApiProvider } from "./base-api.provider";
import { IAIProvider } from "../interfaces/ai-provider.interface";
import {
  CreateImageTo3DRequest,
  MeshyTaskResponse,
} from "../interfaces/meshy-types";

@Injectable()
export class MeshyAIProvider extends BaseApiProvider implements IAIProvider {
  constructor(
    httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl =
      process.env.MESHY_API_URL || "https://api.meshy.ai/openapi/v1";
    super(httpService, baseUrl);
  }

  protected async request<T>(
    method: string,
    path: string,
    data?: any,
  ): Promise<T> {
    const apiKey = process.env.MESHY_API_KEY;

    const config = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    };

    return super.request(method as any, path, data, config);
  }

  async createImageTo3D(
    data: CreateImageTo3DRequest,
  ): Promise<{ result: string }> {
    return this.request<{ result: string }>("post", "/image-to-3d", data);
  }

  async getModelStatus(taskId: string): Promise<MeshyTaskResponse> {
    return this.request<MeshyTaskResponse>("get", `/image-to-3d/${taskId}`);
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.request<void>("delete", `/image-to-3d/${taskId}`);
  }

  async createMultiImageTo3D(
    imageUrls: string[],
    options: Partial<CreateImageTo3DRequest>,
  ): Promise<{ result: string }> {
    return this.request<{ result: string }>("post", "/multi-image-to-3d", {
      image_urls: imageUrls,
      ...options,
    });
  }
}
