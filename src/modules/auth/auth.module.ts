import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), TokensModule, UsersModule],
  providers: [AuthService, PasswordHelper],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
