import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { MaintenanceService } from 'src/modules/maintenance/maintenance.service';
import { TokenService } from 'src/modules/tokens/tokens.service';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private maintenanceService: MaintenanceService,
    private tokenService: TokenService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isMaintenanceOn = this.maintenanceService.getStatus();

    if (!isMaintenanceOn) {
      return next();
    }

    const rawIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    let clientIp = Array.isArray(rawIp) ? rawIp[0] : (rawIp as string);
    if (clientIp && clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.substring(7);
    }

    if (clientIp === '::1' || clientIp === '127.0.0.1') {
      clientIp = '127.0.0.1';
    }

    let isIpWhitelisted = false;
    if (clientIp) {
      isIpWhitelisted = this.maintenanceService.isWhitelistedIp(clientIp);
    }

    let isAuthorizedUser = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.tokenService.validateToken(token);
        if (payload?.userId) {
          isAuthorizedUser = this.maintenanceService.isMaintenanceUser(
            payload.userId,
          );
        }
      } catch (error) {}
    }

    if (!isIpWhitelisted) {
      throw new ServiceUnavailableException(
        'Hệ thống đang trong chế độ bảo trì. Vui lòng thử lại sau.',
      );
    }

    if (req.originalUrl.includes('/auth/')) {
      return next();
    }

    if (!isAuthorizedUser) {
      throw new ServiceUnavailableException(
        'Hệ thống đang trong chế độ bảo trì. Vui lòng thử lại sau.',
      );
    }
    return next();
  }
}
