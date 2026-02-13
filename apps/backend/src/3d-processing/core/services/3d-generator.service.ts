import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Create3DGenerationDto } from "src/3d-processing/http/rest/dto/create-generation.dto";
import {
  createMongoQueryService,
  FilterRequest,
  PaginatedResult,
} from "src/@core/services/mongo-query.service";
import { IAIProvider } from "src/integration/core/interfaces/ai-provider.interface";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";

@Injectable()
export class GeneratorService {
  constructor(
    @Inject("AI_PROVIDER") private readonly aiProvider: IAIProvider,
    private readonly model3DRepository: Model3DRepository,
  ) {}

  async startGeneration(
    dto: Create3DGenerationDto,
    userId?: string,
  ): Promise<Model3D> {
    const { result: externalId } = await this.aiProvider.createImageTo3D({
      image_url: `data:image/png;base64,${dto.imageBase64}`,
      model_type: dto.modelType ?? "standard",
      target_polycount: 40000,
      should_texture: true,
      should_remesh: true,
    });

    return this.model3DRepository.create({
      externalId,
      userId: userId ? new Types.ObjectId(userId) : undefined,
      status: "PENDING",
      name: dto.name,
    });
  }

  async getModel3DById(modelId: string) {
    const task = await this.model3DRepository.findByExternalId(modelId);
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async search(
    filterRequest: FilterRequest,
  ): Promise<PaginatedResult<Model3D>> {
    const baseQuery = { status: "SUCCEEDED" };
    const query = createMongoQueryService<Model3D>(
      this.model3DRepository.getModel(),
    );
    return query.search({
      baseQuery,
      filterRequest,
      options: {
        dateField: "createdAt",
      },
    });
  }
}
