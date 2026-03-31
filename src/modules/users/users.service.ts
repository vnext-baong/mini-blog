import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserListResponse, UserResponse } from './types/user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHelper: PasswordHelper,
  ) {}
  async findAll(): Promise<UserListResponse> {
    const [users, total] = await this.userRepository.findAndCount();
    return new UserListResponse(users, total);
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async create(user: CreateUserDto): Promise<UserResponse> {
    try {
      user.username = user.username.toLowerCase();
      if (await this.userRepository.findOneBy({ username: user.username })) {
        throw new Error('Username already exists');
      }
      const newUser = this.userRepository.create(user);
      newUser.password = this.passwordHelper.encryptPassword(user.password);

      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
