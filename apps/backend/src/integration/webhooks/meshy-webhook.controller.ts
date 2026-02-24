import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { MeshyTaskResponse } from "../core/interfaces/meshy-types";
import { ModelProcessorService } from "../core/service/model-processor.service";
import { Model3DRepository } from "../core/repositories/model-3d.repository";

@Controller("webhooks/meshy")
export class MeshyWebhookController {
  private readonly logger = new Logger(MeshyWebhookController.name);

  constructor(
    @InjectQueue("meshy-processing") private readonly meshyQueue: Queue,
    private readonly modelProcessorService: ModelProcessorService,
    private readonly modelRepository: Model3DRepository,
  ) {}

  @Post()
  @HttpCode(200)
  async handleMeshyUpdate(@Body() payload: MeshyTaskResponse) {
    this.logger.log(
      `Received model updated event: ${payload.id} - Status: ${payload.status}`,
    );
    if (!payload.id) throw new BadRequestException("Invalid payload");
    await this.meshyQueue.add("update-model", payload, {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
    });

    return { received: true };
  }
}
