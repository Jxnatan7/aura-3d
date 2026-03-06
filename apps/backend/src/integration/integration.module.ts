import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MeshyAIProvider } from "./core/providers/meshy-ai.provider";
import { Model3DRepository } from "./core/repositories/model-3d.repository";
import { Model3D, ModelSchema } from "./core/schemas/model-3d.schema";
import { MeshyWebhookController } from "./webhooks/meshy-webhook.controller";
import { BullModule } from "@nestjs/bullmq";
import { MeshyUpdateProcessor } from "src/3d-processing/core/process/meshy-update.process";
import { ModelArchiverService } from "./core/service/model-archiver.service";
import { StorageService } from "./core/service/storage.service";
import { RedisPubSubService } from "./core/service/redis-pubsub.service";
import { S3UploaderService } from "./core/service/s3-uploader.service";
import { ModelProcessorService } from "./core/service/model-processor.service";
import { AssetMigratorService } from "./core/service/asset-migrator.service";
import { FileDownloaderService } from "./core/service/file-downloader.service";
import { ImageProcessingService } from "./core/service/image-processing.service";
import { LikeSchema } from "./core/schemas/like.schema";
import { LikeService } from "./core/service/like.service";
import { LikeRepository } from "./core/repositories/like.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Model3D.name, schema: ModelSchema },
      { name: "Like", schema: LikeSchema },
    ]),
    HttpModule,
    BullModule.registerQueue({
      name: "meshy-processing",
    }),
  ],
  providers: [
    Model3DRepository,
    MeshyUpdateProcessor,
    MeshyAIProvider,
    ModelArchiverService,
    StorageService,
    RedisPubSubService,
    S3UploaderService,
    ModelProcessorService,
    AssetMigratorService,
    FileDownloaderService,
    ImageProcessingService,
    LikeService,
    LikeRepository,
    {
      provide: "AI_PROVIDER",
      useClass: MeshyAIProvider,
    },
  ],
  controllers: [MeshyWebhookController],
  exports: [
    Model3DRepository,
    "AI_PROVIDER",
    BullModule,
    RedisPubSubService,
    LikeRepository,
    LikeService,
  ],
})
export class IntegrationModule {}
