import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../tokens/tokens.service';
import { ConfigService } from '@nestjs/config';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';
import { MailerService } from 'src/helpers/mailer.helper';
import { GoogleUserResult } from './types/google-user-result.type';
import { GoogleOauthToken } from './types/google-auth-token.type';
import axios from 'axios';
import { generateCustomString } from 'src/utils/functions';
import { CONFIRM_REGISTER_GOOGLE } from 'src/common/constants/message';

@Injectable()
export class AuthGoogleService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private passwordHelper: PasswordHelper,
    private mailService: MailerService,
  ) {}

  async getGoogleUser({
    id_token,
    access_token,
  }: {
    id_token: string;
    access_token: string;
  }): Promise<GoogleUserResult> {
    try {
      const { data } = await axios.get<GoogleUserResult>(
        `${this.configService.get<string>('oauth.google_url_access_token')}${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      );
      return data;
    } catch (err: any) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to get user from Google',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getGoogleOauthToken({
    code,
  }: {
    code: string;
  }): Promise<GoogleOauthToken> {
    const options = {
      code,
      client_id: this.configService.get<string>('oauth.google_client_id') || '',
      client_secret:
        this.configService.get<string>('oauth.google_client_secret') || '',
      redirect_uri: `${this.configService.get<string>('app.server_url') || ''}/auth-google`,
      grant_type: 'authorization_code',
    };
    try {
      const { data } = await axios.post<GoogleOauthToken>(
        this.configService.get<string>('oauth.google_url_token') || '',
        new URLSearchParams(options),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return data as GoogleOauthToken;
    } catch (err: any) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to get access token from Google',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(
    codeGoogle: string,
    state: string,
    language: string = 'vi',
  ): Promise<any> {
    try {
      let googleUser;
      if (!codeGoogle) {
        throw new HttpException('Code is required', HttpStatus.BAD_REQUEST);
      }
      const { id_token, access_token } = await this.getGoogleOauthToken({
        code: codeGoogle,
      });

      const { verified_email, email, name, username } =
        await this.getGoogleUser({
          id_token,
          access_token,
        });
      if (!verified_email) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: 'Email not verified by Google',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const passwordUser = generateCustomString(12);
        const hashedPassword =
          this.passwordHelper.encryptPassword(passwordUser);
        const userId = generateCustomString(20).toLowerCase();

        const mappedData: any = {
          id: userId,
          username: username || email.split('@')[0],
          email: email,
          emailVerified: true,
          password: hashedPassword,
          name: name,
        };
        googleUser = await this.userService.create(mappedData);
        if (!googleUser) {
          throw new HttpException(
            'Failed to create user',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const { titles, content } = CONFIRM_REGISTER_GOOGLE(
          language,
          email,
          name,
        );
        await this.mailService.sendMail(email, titles, content);
      } else if (!user['emailVerified']) {
        await this.userService.updateEmailVerified(email);
        googleUser = user;
      } else {
        googleUser = user;
      }

      const payload = {
        userId: googleUser.id,
        email: googleUser.email,
      };

      const { accessToken, refreshToken } =
        await this.tokenService.createOne(payload);
      const destination = `?ac=${accessToken}&rf=${refreshToken}`;

      const redirectUrl = `${
        this.configService.get<string>('app.client_url') || ''
      }/login-success.html${destination}`;
      return {
        redirectUrl,
      };
    } catch (err: any) {
      console.error(err);

      const redirectUrl = `${
        this.configService.get<string>('app.client_url') || ''
      }/login?oauth=false`;
      return { redirectUrl };
    }
  }
}
