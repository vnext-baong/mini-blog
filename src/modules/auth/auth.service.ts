import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';
import { User } from 'src/database/entities/user.entity';
import { TokenService } from '../tokens/tokens.service';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from 'src/common/types/response';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { generateId } from 'src/utils/functions';
import { MailerService } from 'src/helpers/mailer.helper';
import { CONFIRM_REGISTER } from 'src/common/constants/message';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly passwordHelper: PasswordHelper,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({
        username: loginDto.username,
      });
      if (!user) {
        throw new UnauthorizedException('Invalid username or password');
      }
      if (
        !this.passwordHelper.comparePassword(loginDto.password, user.password)
      ) {
        throw new UnauthorizedException('Invalid username or password');
      }
      const payload = {
        userId: user.id,
        username: user.username,
      };
      const { accessToken, refreshToken } = await this.tokenService.createOne(
        payload,
        false,
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<MessageResponse> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        username: registerDto.username,
      });
      if (existingUser) {
        throw new UnauthorizedException('Username already exists');
      }
      const hashedPassword = await this.passwordHelper.encryptPassword(
        registerDto.password,
      );
      const userId = generateId().toLowerCase();
      const newUser = this.userRepository.create({
        id: userId,
        username: registerDto.username,
        password: hashedPassword,
        name: registerDto.name,
        email: registerDto.email,
        emailVerified: false,
      });
      await this.userRepository.save(newUser);

      const payload = {
        userId: newUser.id,
        username: newUser.username,
      };

      const { accessToken } = await this.tokenService.createOne(payload);
      const confirmUrl = `${this.configService.get<string>('app.client_url')}/verify-email.html?token=${accessToken}`;
      const html = CONFIRM_REGISTER('vi', newUser.name, confirmUrl);
      this.mailerService.sendMail(newUser.email, html.titles, html.content);
      return {
        statusCode: HttpStatus.OK,
        message: 'User registered successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<MessageResponse> {
    try {
      const user = await this.userRepository.findOneBy({
        id: changePasswordDto.userId,
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const isMatch = await this.passwordHelper.comparePassword(
        changePasswordDto.currentPassword,
        user.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      const hashedPassword = await this.passwordHelper.encryptPassword(
        changePasswordDto.newPassword,
      );
      user.password = hashedPassword;
      await this.userRepository.save(user);
      return {
        statusCode: 200,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<MessageResponse> {
    try {
      const tokenData = await this.tokenService.validateToken(token);
      const userId = tokenData.userId;
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.emailVerified) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Email already verified',
        };
      }
      user.emailVerified = true;
      await this.userRepository.save(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async sendVerifyEmail(email: string): Promise<MessageResponse> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.emailVerified) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Email already verified',
        };
      }
      const payload = {
        userId: user.id,
        username: user.username,
      };
      const { accessToken } = await this.tokenService.createOne(payload);
      const confirmUrl = `${this.configService.get<string>('app.client_url')}/verify-email.html?token=${accessToken}`;
      const html = CONFIRM_REGISTER('vi', user.name, confirmUrl);
      this.mailerService.sendMail(user.email, html.titles, html.content);
      return {
        statusCode: HttpStatus.OK,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
