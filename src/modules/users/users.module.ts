import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokensModule],
  providers: [UsersService, PasswordHelper],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
