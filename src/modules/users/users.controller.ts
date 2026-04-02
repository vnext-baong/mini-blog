import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserListResponse, UserResponse } from './types/user.type';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(): Promise<UserListResponse> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('top-published')
  async topUsersPulished(): Promise<UserListResponse> {
    return this.usersService.topUsersPublished();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return new UserResponse();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }
}
