import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "./user/user.module";

import { IntegrationModule } from "./integration/integration.module";
import { Processing3dModule } from "./3d-processing/3d-processing.module";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL ?? "", { dbName: "aura-3d" }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST") ?? "localhost",
          port: configService.get("REDIS_PORT") ?? 6379,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    IntegrationModule,
    Processing3dModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
