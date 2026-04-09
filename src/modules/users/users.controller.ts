import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserListResponse, UserResponse } from './types/user.type';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { plainToClass } from 'class-transformer';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
@JwtAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(): Promise<UserListResponse> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('me')
  async getMyself(@Req() req): Promise<UserResponse> {
    const { userLogged } = req;
    const userData = plainToClass(UserResponse, userLogged, {
      excludeExtraneousValues: true,
    });
    return userData;
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
