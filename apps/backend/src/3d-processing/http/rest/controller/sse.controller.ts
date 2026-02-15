import { Controller, Sse, Param } from "@nestjs/common";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";
import { RedisPubSubService } from "src/integration/core/service/redis-pubsub.service";

export type ModelUpdatedPayload = {
  modelId: string;
  status: string;
  progress: number;
  data: Model3D;
};

@Controller("api/v1/sse")
export class SseController {
  constructor(private readonly redisPubSub: RedisPubSubService) {}

  @Sse("model/:id")
  sse(@Param("id") id: string): Observable<MessageEvent> {
    const targetChannel = `sse:model.updated.${id}`;

    return this.redisPubSub.events.pipe(
      filter((event) => event.channel === targetChannel),
      map((event) => {
        const payload = event.payload as ModelUpdatedPayload;
        return {
          data: {
            modelId: payload.modelId,
            status: payload.status,
            progress: payload.progress,
            data: payload.data,
          },
        } as MessageEvent;
      }),
    );
  }
}
