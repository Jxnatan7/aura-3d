import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
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
import { LikeRepository } from "src/integration/core/repositories/like.repository";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import {
  EmbeddedUser,
  Model3D,
} from "src/integration/core/schemas/model-3d.schema";
import { Model3DResponseDto } from "src/integration/http/rest/dto/model-response.dto";

@Injectable()
export class GeneratorService {
  constructor(
    @Inject("AI_PROVIDER") private readonly aiProvider: IAIProvider,
    private readonly model3DRepository: Model3DRepository,
    private readonly likeRepository: LikeRepository,
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
      target_polycount: 300000,
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

  async syncModel3D(modelExternalId: string) {
    const model = await this.aiProvider.getModelStatus(modelExternalId);
    await this.model3DRepository.updateByExternalId(modelExternalId, model);
  }

  async getModel3DById(
    modelId: string,
    currentUserId?: string,
  ): Promise<Model3DResponseDto> {
    const model = await this.model3DRepository.findByExternalId(modelId);
    if (!model) throw new NotFoundException("Model not found");

    const userObjectId = toObjectIdOrLeave(currentUserId);
    let isLikedByMe = false;

    if (userObjectId) {
      const like = await this.likeRepository.exists({
        userId: userObjectId,
        modelId: model.id,
      });
      isLikedByMe = !!like;
    }

    // Convertendo para DTO também na busca por ID para manter o padrão
    const dto = plainToInstance(
      Model3DResponseDto,
      model.toJSON ? model.toJSON() : model,
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );

    dto.isLikedByMe = isLikedByMe;
    return dto;
  }

  async search(
    filterRequest: FilterRequest,
    currentUserId?: string,
  ): Promise<PaginatedResult<Model3DResponseDto>> {
    const baseQuery = {
      status: "SUCCEEDED",
      thumbnailUrl: { $exists: true, $nin: [null, ""] },
    };

    if (filterRequest.userId) {
      baseQuery["user._id"] = toObjectIdOrLeave(filterRequest.userId);
    }

    const query = createMongoQueryService<Model3D>(
      this.model3DRepository.getModel(),
    );

    const paginated = await query.search({
      baseQuery,
      filterRequest,
      options: { dateField: "createdAt" },
    });

    let likedModelIds = new Set<string>();

    // Se tiver usuário logado e houver itens, buscamos os likes
    if (currentUserId && paginated.items.length > 0) {
      const modelIds = paginated.items.map((item) => item._id);
      const userLikes = await this.likeRepository.findByModelIdsAndUserId(
        modelIds,
        currentUserId,
      );
      likedModelIds = new Set(userLikes.map((like) => like.model.toString()));
    }

    // Mapeia os documentos do Mongoose para o DTO
    const transformedItems = paginated.items.map((item) => {
      // 1. Converte o Doc do Mongoose pra Objeto JS (fundamental para o class-transformer ler o _id)
      const plainObject = item.toJSON ? item.toJSON() : item;

      // 2. Converte pro DTO limpando os dados sensíveis
      const dto = plainToInstance(Model3DResponseDto, plainObject, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      // 3. Atribui o like verificando o Set
      dto.isLikedByMe = likedModelIds.has(dto.id.toString());

      return dto;
    });

    // Retorna um NOVO objeto com a mesma paginação, mas sobrescrevendo a propriedade items
    return {
      ...paginated,
      items: transformedItems,
    };
  }
}
