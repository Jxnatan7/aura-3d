import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MeshyTaskResponse } from "../core/interfaces/meshy-types";

@Controller("webhooks/meshy")
export class MeshyWebhookController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post()
  @HttpCode(200)
  async handleMeshyUpdate(@Body() payload: MeshyTaskResponse) {
    console.log(
      "🚀 ~ MeshyWebhookController ~ handleMeshyUpdate ~ payload:",
      payload,
    );
    if (!payload.id) throw new BadRequestException("Invalid payload");

    this.eventEmitter.emit("3d.task.updated", payload);

    return { received: true };
  }
}
