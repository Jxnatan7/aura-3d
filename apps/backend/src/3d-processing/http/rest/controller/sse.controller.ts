import { Controller, Sse, Param } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Observable, fromEvent } from "rxjs";
import { map, filter } from "rxjs/operators";

const getId = (str: string) => {
  const regex = /'([^']+)'/;
  const match = str.match(regex);

  if (match) {
    const id = match[1];
    return id;
  }
};

@Controller("api/v1/sse")
export class SseController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Sse("model/:id")
  sse(@Param("id") id: string): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, "model.updated").pipe(
      filter((payload: any) => {
        return String(payload.data?._id) === id;
      }),
      map(
        (payload) =>
          ({
            data: payload,
          }) as MessageEvent,
      ),
    );
  }
}
