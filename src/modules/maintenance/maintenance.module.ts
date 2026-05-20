import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceIp } from 'src/database/entities/maintenance-ip.entity';
import { MaintenanceUser } from 'src/database/entities/maintenance-user.entity';
import { MaintenanceConfig } from 'src/database/entities/maintenance-config.entity';
import { User } from 'src/database/entities/user.entity';
import { TokensModule } from 'src/modules/tokens/tokens.module';
import { UsersModule } from 'src/modules/users/users.module';
import { MailerService } from 'src/helpers/mailer.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceIp,
      MaintenanceUser,
      MaintenanceConfig,
      User,
    ]),
    TokensModule,
    UsersModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MailerService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
