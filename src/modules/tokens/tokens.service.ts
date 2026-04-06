import {
  UnprocessableEntityException,
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Token } from 'src/database/entities/token.entity';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { TokenResponse } from './types/token.type';
import { TokenData } from './types/token-data.type';
import { generateKeyOfToken } from 'src/helpers/crypto.helper';

@Injectable()
export class TokenService {
  public publicKey: string;

  private expiredAccessToken = '1d';
  private expiredRefreshToken = '30d';
  private expiredVerifyToken = '15m';

  constructor(
    @InjectRepository(Token)
    private readonly tokenRes: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async getOne(id: string): Promise<Token> {
    const token = await this.tokenRes.findOne({ where: { id } });
    if (!token) {
      throw new UnprocessableEntityException('Token not found');
    }
    return token;
  }

  async delete(id: string) {
    return await this.tokenRes.delete({ id });
  }

  async save(token: DeepPartial<Token>): Promise<Token> {
    return await this.tokenRes.save(token);
  }

  generateToken(payload: any, key: string, expiresIn: any) {
    const options: jwt.SignOptions = {
      expiresIn: expiresIn,
      algorithm: 'RS256',
      allowInsecureKeySizes: true,
    };
    const token = jwt.sign(payload, key, options);
    return token;
  }

  async createOne(
    payload: TokenPayloadDto,
    isVerifyToken: boolean = false,
  ): Promise<TokenResponse> {
    const { publicKey: accessPublicKey, privateKey: accessPrivateKey }: any =
      await generateKeyOfToken();
    const { publicKey: refreshPublicKey, privateKey: refreshPrivateKey }: any =
      await generateKeyOfToken();

    const currentDate = new Date();

    const expiresAt = new Date();
    if (isVerifyToken) {
      expiresAt.setMinutes(15);
    } else {
      expiresAt.setMonth(
        currentDate.getMonth() === 12 ? 1 : currentDate.getMonth() + 1,
      );
    }

    const dataToken = {
      refreshToken: '',
      userId: payload.userId,
      accessPublicKey,
      refreshPublicKey,
      expiresAt,
      createdAt: new Date(),
    };

    const token = await this.save(dataToken);
    const payloadFormat = JSON.stringify({ ...payload, tokenId: token.id });

    const accessToken = this.generateToken(
      JSON.parse(payloadFormat),
      accessPrivateKey,
      isVerifyToken ? this.expiredVerifyToken : this.expiredAccessToken,
    );

    const refreshToken = this.generateToken(
      JSON.parse(payloadFormat),
      refreshPrivateKey,
      isVerifyToken ? this.expiredVerifyToken : this.expiredRefreshToken,
    );

    token.refreshToken = refreshToken;

    await this.save(token);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(accessToken: any): Promise<TokenData> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Token is required');
      }
      const payload = this.jwtService.decode(accessToken);

      const { tokenId } = payload;
      const tokenDb = await this.getOne(tokenId);

      if (!tokenDb) {
        throw new UnprocessableEntityException('Invalid or expired token');
      }

      const publicKey = tokenDb.accessPublicKey;

      jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
          throw new UnauthorizedException('Invalid or expired token');
        }
      });

      return payload;
    } catch (error) {
      throw new BadRequestException('Token is required');
    }
  }

  async createNewAccessToken(token: string): Promise<TokenResponse> {
    try {
      const decodeTokenData: any = this.jwtService.decode(token);
      if (!decodeTokenData) {
        throw new BadRequestException('Invalid or expired token');
      }
      const { tokenId, email } = decodeTokenData;
      const tokenDb = await this.getOne(tokenId);

      if (!tokenDb) {
        throw new UnprocessableEntityException('Invalid or expired token');
      }

      const { refreshToken, userId, refreshPublicKey, updatedAt } = tokenDb;

      jwt.verify(refreshToken, refreshPublicKey, (err, decode) => {
        if (err) {
          this.delete(tokenId);
          throw new UnprocessableEntityException('Invalid or expired token');
        }
      });

      const { publicKey: accessPublicKey, privateKey: accessPrivateKey }: any =
        await generateKeyOfToken();

      const payload = {
        userId: userId,
        email: email,
      };

      const payloadFormat = JSON.stringify({ ...payload, tokenId });

      const accessToken = this.generateToken(
        JSON.parse(payloadFormat),
        accessPrivateKey,
        this.expiredAccessToken,
      );

      tokenDb.accessPublicKey = accessPublicKey;
      tokenDb.updatedAt = new Date();

      await this.save(tokenDb);

      return {
        accessToken,
      };
    } catch (err) {
      throw err;
    }
  }
}
