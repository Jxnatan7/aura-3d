import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./core/schemas/user.schema";
import { UserController } from "./http/rest/controller/user.controller";
import { UserService } from "./core/services/user.service";
import { ConfigModule } from "@nestjs/config";
import { UserRepository } from "./core/repositories/UserRepository";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, MongooseModule, UserRepository],
})
export class UserModule {}
