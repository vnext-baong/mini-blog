import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthGoogleService } from './auth-google.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth-google')
export class AuthGoogleController {
  constructor(
    private authService: AuthGoogleService,
    private configService: ConfigService,
  ) {}

  @Get()
  async signIn(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;
    const { redirectUrl } = await this.authService.signIn(
      `${code}`,
      `${state}`,
      'vi',
    );
    res.redirect(301, redirectUrl);
  }
}
