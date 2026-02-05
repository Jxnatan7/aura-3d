import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { MessagesHelper } from "../../@helpers/messages.helper";
import { User } from "src/user/core/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "phone" });
  }

  public async validate(phone: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException({
        message: MessagesHelper.CREDENTIALS_INVALID,
      });
    }
    return user;
  }
}
