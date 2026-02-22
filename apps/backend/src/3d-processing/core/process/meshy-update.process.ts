import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { MeshyTaskResponse } from "src/integration/core/interfaces/meshy-types";
import { Model3DRepository } from "src/integration/core/repositories/model-3d.repository";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";
import { RedisPubSubService } from "src/integration/core/service/redis-pubsub.service";
import { ModelProcessorService } from "src/integration/core/service/model-processor.service";

@Processor("meshy-processing")
export class MeshyUpdateProcessor extends WorkerHost {
  private readonly logger = new Logger(MeshyUpdateProcessor.name);

  constructor(
    private readonly model3DRepo: Model3DRepository,
    private readonly redisPubSub: RedisPubSubService,
    private readonly modelProcessor: ModelProcessorService,
  ) {
    super();
  }

  async process(job: Job<MeshyTaskResponse, any, string>): Promise<any> {
    const payload = job.data;

    this.logger.log(
      `Processing job ${job.id}: Model update for ${payload.id} - Status: ${payload.status}`,
    );

    const model3D = await this.model3DRepo.findByExternalId(payload.id);

    if (!model3D) {
      this.logger.error(`Model ${payload.id} not found.`);
      return;
    }

    try {
      const updateData: Partial<Model3D> = {
        ...payload,
        externalId: payload.id,
        name: model3D?.name,
        userId: model3D?.userId,
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

      if (updateData.status === "SUCCEEDED") {
        const downloadedFiles = await this.downloadFiles(updateData);
        updateData.modelUrls = downloadedFiles.modelUrls;
        updateData.thumbnailUrl = downloadedFiles.thumbnailUrl;
      }

      const updatedModel = await this.model3DRepo.updateByExternalId(
        payload.id,
        updateData,
      );
      this.logger.debug(`Model ${payload.id} successfully updated.`);

      await this.redisPubSub.publish(`sse:model.updated.${updatedModel._id}`, {
        modelId: updatedModel._id,
        status: updatedModel.status,
        progress: updatedModel.progress,
        data: updatedModel,
      });

      this.logger.debug(`Event emitted for model ${updatedModel._id}.`);

      return { success: true, id: payload.id };
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}: ${error.message}`);
      throw error;
    }
  }

  async downloadFiles(payload: Partial<Model3D>) {
    const response = await this.modelProcessor.process(payload);
    const { modelUrls, thumbnailUrl } = response;

    return { modelUrls, thumbnailUrl };
  }
}
