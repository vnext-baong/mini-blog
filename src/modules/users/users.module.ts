import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, PasswordHelper],
  controllers: [UsersController],
})
export class UsersModule {}
