import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user, 'user hai nhai');
    const userId = request.user?._id?.toString();
    const user = {
      id: userId,
      ...request.user,
    };
    return data ? user?.[data] : user;
  },
);
