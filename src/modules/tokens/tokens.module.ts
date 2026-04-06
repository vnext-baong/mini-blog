import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokenService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/database/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), JwtModule],
  controllers: [TokensController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokensModule {}
