import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/core/services/user.service";
import { User } from "src/user/core/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    phone: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.findByPhone(phone);

    if (!user) return undefined;

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return undefined;

    return user;
  }

  async login(user: User) {
    const payload = {
      id: user._id,
      sub: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async googleLogin(accessToken: string) {
    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!googleResponse.ok) {
      throw new UnauthorizedException("Token do Google inválido ou expirado.");
    }

    const googleUser = await googleResponse.json();
    let user = await this.userService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.userService.create({
        email: googleUser.email,
        name: googleUser.name,
      } as any);
    }

    return this.login(user);
  }
}
