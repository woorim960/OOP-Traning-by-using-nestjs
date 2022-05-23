import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserLoginDto } from 'src/users/dto/user-login.dto';

export const User = createParamDecorator<string>(
  (data: string, ctx: ExecutionContext): string | UserLoginDto => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
