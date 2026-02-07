import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { MeshyTaskResponse } from "src/integration/core/interfaces/meshy-types";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";

@Processor("meshy-processing")
export class MeshyUpdateProcessor extends WorkerHost {
  private readonly logger = new Logger(MeshyUpdateProcessor.name);

  constructor(private readonly model3DRepo: Model3DRepository) {
    super();
  }

  async process(job: Job<MeshyTaskResponse, any, string>): Promise<any> {
    const payload = job.data;
    console.log("🚀 ~ MeshyUpdateProcessor ~ process ~ payload:", payload);

    this.logger.log(
      `Processing job ${job.id}: Model update for ${payload.id} - Status: ${payload.status}`,
    );

    try {
      const updateData: Partial<Model3D> = {
        ...payload,
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

      await this.model3DRepo.updateByExternalId(payload.id, updateData);
      this.logger.debug(`Model ${payload.id} successfully updated.`);

      return { success: true, id: payload.id };
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}: ${error.message}`);
      throw error;
    }
  }
}
