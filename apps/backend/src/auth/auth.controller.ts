import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { UserService } from "src/user/core/services/user.service";
import { CreateUserDto } from "src/user/http/rest/dto/create-user.dto";
import { User } from "src/user/core/schemas/user.schema";

@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard("local"))
  @HttpCode(200)
  @Post("login")
  public async login(@Req() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post("register")
  public async register(@Body() createUserRequest: CreateUserDto) {
    const user = await this.userService.create(createUserRequest);
    return { user };
  }

  @Post("google")
  @HttpCode(200)
  public async googleLogin(@Body() body: { accessToken: string }) {
    const accessToken = body.accessToken;

    if (!accessToken) {
      throw new BadRequestException("Access token do Google não fornecido.");
    }

    return this.authService.googleLogin(accessToken);
  }
}
