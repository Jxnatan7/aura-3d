import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Create3DGenerationDto } from "src/3d-processing/http/rest/dto/create-generation.dto";
import {
  createMongoQueryService,
  FilterRequest,
  PaginatedResult,
  toObjectIdOrLeave,
} from "src/@core/services/mongo-query.service";
import { UserJwt } from "src/@decorators/user.decorator";
import { IAIProvider } from "src/integration/core/interfaces/ai-provider.interface";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import {
  EmbeddedUser,
  Model3D,
} from "src/integration/core/schemas/model-3d.schema";

@Injectable()
export class GeneratorService {
  constructor(
    @Inject("AI_PROVIDER") private readonly aiProvider: IAIProvider,
    private readonly model3DRepository: Model3DRepository,
  ) {}

  async startGeneration(
    dto: Create3DGenerationDto,
    user?: UserJwt,
  ): Promise<Model3D> {
    const { result: externalId } = await this.aiProvider.createImageTo3D({
      image_url: `data:image/png;base64,${dto.imageBase64}`,
      model_type: dto.modelType ?? "standard",
      enable_pbr: true,
      should_texture: true,
      texture_image_url: `data:image/png;base64,${dto.imageBase64}`,
      target_polycount: 100000,
      should_remesh: true,
    });

    const embeddedUser = new EmbeddedUser();

    if (user) {
      embeddedUser._id = toObjectIdOrLeave(user.id) as Types.ObjectId;
      embeddedUser.name = user.name;
      embeddedUser.email = user.email;
    }

    return this.model3DRepository.create({
      externalId,
      user: embeddedUser,
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
