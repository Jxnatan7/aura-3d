import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MeshyAIProvider } from "./core/providers/meshy-ai.provider";
import { Model3DRepository } from "./core/repositories/model-3d.repository";
import { Model3dUpdatedListener } from "src/3d-processing/core/listener/model-3d-updated.listener";
import { Model3D, ModelSchema } from "./core/schemas/model-3d.schema";
import { MeshyWebhookController } from "./webhooks/meshy-webhook.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model3D.name, schema: ModelSchema }]),
    HttpModule,
  ],
  providers: [
    Model3DRepository,
    Model3dUpdatedListener,
    MeshyAIProvider,
    {
      provide: "AI_PROVIDER",
      useClass: MeshyAIProvider,
    },
  ],
  controllers: [MeshyWebhookController],
  exports: [Model3DRepository, "AI_PROVIDER"],
})
export class IntegrationModule {}
