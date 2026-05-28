import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGoogleController } from './auth-google.controller';
import { PasswordHelper } from 'src/helpers/bcrypt.helper';
import { MailerService } from 'src/helpers/mailer.helper';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, TokensModule],
  providers: [AuthGoogleService, MailerService, PasswordHelper],
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
