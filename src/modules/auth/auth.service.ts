import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';
import { User } from 'src/database/entities/user.entity';
import { TokenService } from '../tokens/tokens.service';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from 'src/common/types/response';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({
        username: loginDto.username,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      if (
        !this.passwordHelper.comparePassword(loginDto.password, user.password)
      ) {
        throw new UnauthorizedException();
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
      const newUser = this.userRepository.create({
        username: registerDto.username,
        name: registerDto.name,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
      return {
        statusCode: 201,
        message: 'User registered successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
