import { Body, Controller } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { CreateNewAccessTokenDto } from './dto/create-new-accesstoken.dto';
import { TokenResponse } from './types/token.type';
import { Post } from '@nestjs/common';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokenService) {}
  @Post('access-token')
  async getNewAccessToken(
    @Body() body: CreateNewAccessTokenDto,
  ): Promise<TokenResponse> {
    return await this.tokensService.createNewAccessToken(body.refreshToken);
  }
}
