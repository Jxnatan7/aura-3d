import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MeshyTaskResponse } from "src/integration/core/interfaces/meshy-types";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";

@Injectable()
export class Model3dUpdatedListener {
  private readonly logger = new Logger(Model3dUpdatedListener.name);

  constructor(private readonly model3DRepo: Model3DRepository) {}

  @OnEvent("3d.model.updated")
  async handleTaskUpdate(payload: MeshyTaskResponse) {
    this.logger.log(
      `Received model updated event: ${payload.id} - Status: ${payload.status}`,
    );

    const model3D = await this.model3DRepo.findByExternalId(payload.id);

    if (!model3D) {
      this.logger.error(`Model ${payload.id} not found.`);
      return;
    }

    const updateData: Partial<Model3D> = {
      ...model3D,
      ...payload,
      name: model3D?.name,
      status: payload.status,
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
      this.logger.debug(`Model ${payload.id} updated in the database.`);
    } catch (error) {
      this.logger.error(`Error updating model ${payload.id}: ${error.message}`);
    }
  }
}
