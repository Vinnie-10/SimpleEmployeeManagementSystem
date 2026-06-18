import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
      super();
    }

    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
      if (err || !user) throw new UnauthorizedException('Invalid or missing token');

      const reflector = this.reflector;
      const requiredRoles = reflector.get<string[]>('roles', context.getHandler());
      if (requiredRoles && !requiredRoles.includes(user.role)) {
          throw new ForbiddenException('You do not have permission');
      }
      return user;
    }
  }