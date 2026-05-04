import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/modules/tokens/tokens.service';
import { UsersService } from 'src/modules/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
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
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(authorization?: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
