import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MeshyAIProvider } from "./core/providers/meshy-ai.provider";
import { Model3DRepository } from "./core/repositories/model-3d.repository";
import { Model3D, ModelSchema } from "./core/schemas/model-3d.schema";
import { MeshyWebhookController } from "./webhooks/meshy-webhook.controller";
import { BullModule } from "@nestjs/bullmq";
import { MeshyUpdateProcessor } from "src/3d-processing/core/process/meshy-update.process";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model3D.name, schema: ModelSchema }]),
    HttpModule,
    BullModule.registerQueue({
      name: "meshy-processing",
    }),
  ],
  providers: [
    Model3DRepository,
    MeshyUpdateProcessor,
    MeshyAIProvider,
    {
      provide: "AI_PROVIDER",
      useClass: MeshyAIProvider,
    },
  ],
  controllers: [MeshyWebhookController],
  exports: [Model3DRepository, "AI_PROVIDER", BullModule],
})
export class IntegrationModule {}
