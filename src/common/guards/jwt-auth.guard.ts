import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/modules/tokens/tokens.service';
import { UsersService } from 'src/modules/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      let token: string | undefined;
      let requestOrClient: any;

      if (context.getType() === 'http') {
        requestOrClient = context.switchToHttp().getRequest();
        token = this.extractTokenFromHeader(
          requestOrClient.headers.authorization,
        );
      } else if (context.getType() === 'ws') {
        requestOrClient = context.switchToWs().getClient();
        const authHeader = requestOrClient.handshake?.headers?.authorization;
        const authToken = requestOrClient.handshake?.auth?.token;
        token = authHeader
          ? this.extractTokenFromHeader(authHeader)
          : authToken;
      }

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
      const payload = await this.tokenService.validateToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      const user = await this.usersService.findOne(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (context.getType() === 'http') {
        requestOrClient.userLogged = user;
      } else if (context.getType() === 'ws') {
        requestOrClient.user = user;
      }

      const roles = this.reflector.get<string[] | string>(
        'roles',
        context.getHandler(),
      );

      if (roles && user.roles) {
        const userRolesArray = user.roles.split(' ');
        const hasRequiredRole = Array.isArray(roles)
          ? roles.some((role) => userRolesArray.includes(role))
          : userRolesArray.includes(roles);

        if (!hasRequiredRole) {
          throw new ForbiddenException(
            'You do not have permission (Forbidden)',
          );
        }
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(authorization?: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
