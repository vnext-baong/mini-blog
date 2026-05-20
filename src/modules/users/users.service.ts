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
    const userResponses = users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      roles: user.roles,
    }));
    return {
      items: userResponses,
      total,
    };
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async topUsersPublished(): Promise<UserListResponse> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('users');
      const users = await queryBuilder
        .select('users.name', 'name')
        .addSelect('COUNT(posts.id)', 'postCount')
        .where('posts.deletedAt IS NULL')
        .andWhere('posts.published IS true')
        .innerJoin('users.posts', 'posts')
        .groupBy('users.id')
        .orderBy('postCount', 'DESC')
        .limit(5)
        .getRawMany();

      return {
        items: users,
        total: users.length,
      };
    } catch (error) {
      throw error;
    }
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
