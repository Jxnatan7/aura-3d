import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MeshyTaskResponse } from "src/integration/core/interfaces/meshy-types";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";

@Injectable()
export class Model3dUpdatedListener {
  private readonly logger = new Logger(Model3dUpdatedListener.name);

  constructor(private readonly model3DRepo: Model3DRepository) {}

  @OnEvent("3d.task.updated")
  async handleTaskUpdate(payload: MeshyTaskResponse) {
    this.logger.log(
      `Recebendo atualização da Task: ${payload.id} - Status: ${payload.status}`,
    );

    const updateData: Partial<Model3D> = {
      ...payload,
      modelUrls: payload.model_urls,
      textureUrls: payload.texture_urls,
      startedAt: payload.started_at,
      externalCreatedAt: payload.created_at,
      expiresAt: payload.expires_at,
      finishedAt: payload.finished_at,
      thumbnailUrl: payload.thumbnail_url,
      texturePrompt: payload.texture_prompt,
      rawMetadata: payload,
    };

    try {
      await this.model3DRepo.updateByExternalId(payload.id, updateData);
      this.logger.debug(
        `Task ${payload.id} atualizada com sucesso no banco de dados.`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar Task ${payload.id} no banco: ${error.message}`,
      );
    }
  }
}
