import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { Model3dUpdatedListener } from "src/3d-processing/core/listener/model-3d-updated.listener";
import { GeneratorService } from "./core/services/3d-generator.service";
import { GeneratorController } from "./http/rest/controller/3d-generator.controller";
import { IntegrationModule } from "src/integration/integration.module";
import { SseController } from "./http/rest/controller/sse.controller";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [HttpModule, IntegrationModule, UserModule],
  providers: [Model3dUpdatedListener, GeneratorService],
  exports: [Model3dUpdatedListener],
  controllers: [GeneratorController, SseController],
})
export class Processing3dModule {}
