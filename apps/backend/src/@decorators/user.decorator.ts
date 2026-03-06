import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type UserJwt = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
};

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserJwt;
  },
);
