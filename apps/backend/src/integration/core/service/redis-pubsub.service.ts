import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis, RedisOptions } from "ioredis";
import { Subject } from "rxjs";

@Injectable()
export class RedisPubSubService implements OnModuleDestroy {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly logger = new Logger(RedisPubSubService.name);

  public readonly events = new Subject<{ channel: string; payload: any }>();

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>("REDIS_HOST") ?? "localhost";
    const port = this.configService.get<number>("REDIS_PORT") ?? 6379;

    const password = this.configService.get<string>("REDIS_PASSWORD");

    const redisOptions: RedisOptions = {
      host,
      port,
      ...(password && { password }),
    };

    this.publisher = new Redis(redisOptions);
    this.subscriber = new Redis(redisOptions);

    this.subscriber.psubscribe("sse:*", (err, count) => {
      if (err) {
        this.logger.error("Erro ao se inscrever no padrão sse:*", err);
      } else {
        this.logger.log(
          `Inscrito com sucesso em ${count} padrão(ões) do Redis Pub/Sub.`,
        );
      }
    });

    this.subscriber.on("pmessage", (pattern, channel, message) => {
      try {
        const payload = JSON.parse(message);
        this.events.next({ channel, payload });
      } catch (error) {
        this.logger.error(
          `Erro ao fazer parse da mensagem no canal ${channel}`,
          error,
        );
      }
    });

    this.publisher.on("error", (err) =>
      this.logger.error("Publisher Error:", err),
    );
    this.subscriber.on("error", (err) =>
      this.logger.error("Subscriber Error:", err),
    );
  }

  async publish(channel: string, payload: any): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(payload));
  }

  onModuleDestroy() {
    this.logger.log("Desconectando do Redis Pub/Sub...");
    this.publisher.disconnect();
    this.subscriber.disconnect();
  }
}
