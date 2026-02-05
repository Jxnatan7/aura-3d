import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "./user/user.module";

import { IntegrationModule } from "./integration/integration.module";
import { Processing3dModule } from "./3d-processing/3d-processing.module";

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL ?? "", { dbName: "aura-3d" }),
    AuthModule,
    UserModule,
    IntegrationModule,
    Processing3dModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
