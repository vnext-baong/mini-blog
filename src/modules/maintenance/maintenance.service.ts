import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { MaintenanceIp } from 'src/database/entities/maintenance-ip.entity';
import { MaintenanceUser } from 'src/database/entities/maintenance-user.entity';
import { MaintenanceConfig } from 'src/database/entities/maintenance-config.entity';
import { User } from 'src/database/entities/user.entity';
import { MailerService } from 'src/helpers/mailer.helper';
import { NOTI_MAINTENANCE } from 'src/common/constants/message';

@Injectable()
export class MaintenanceService implements OnModuleInit {
  private isMaintenanceActive = false;
  private whitelistedIpsCache: Set<string> = new Set();
  private maintenanceUsersCache: Set<string> = new Set();

  constructor(
    @InjectRepository(MaintenanceIp)
    private readonly maintenanceIpRepo: Repository<MaintenanceIp>,
    @InjectRepository(MaintenanceUser)
    private readonly maintenanceUserRepo: Repository<MaintenanceUser>,
    @InjectRepository(MaintenanceConfig)
    private readonly maintenanceConfigRepo: Repository<MaintenanceConfig>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async onModuleInit() {
    let config = await this.maintenanceConfigRepo.findOne({ where: {} });
    if (!config) {
      config = this.maintenanceConfigRepo.create({ isActive: false });
      await this.maintenanceConfigRepo.save(config);
    }
    this.isMaintenanceActive = config.isActive;
    await this.refreshCache();
  }

  async refreshCache() {
    const [ips, users] = await Promise.all([
      this.maintenanceIpRepo.find(),
      this.maintenanceUserRepo.find(),
    ]);

    this.whitelistedIpsCache = new Set(ips.map((record) => record.ip));
    this.maintenanceUsersCache = new Set(users.map((record) => record.userId));
  }

  getStatus(): boolean {
    return this.isMaintenanceActive;
  }

  async toggleMaintenance(isActive: boolean) {
    let config = await this.maintenanceConfigRepo.findOne({ where: {} });
    if (!config) {
      config = this.maintenanceConfigRepo.create({ isActive });
    } else {
      config.isActive = isActive;
    }

    await this.maintenanceConfigRepo.save(config);
    this.isMaintenanceActive = isActive;

    if (isActive) {
      await this.refreshCache();

      try {
        const users = await this.userRepo.find({
          where: { email: Not(IsNull()) },
        });
        const emails = users.map((u) => u.email).filter((e) => e);
        if (emails.length > 0) {
          let today = new Date();
          const html = NOTI_MAINTENANCE('vi', today);
          await this.mailerService.sendMail(
            emails[0],
            html.title,
            html.content,
          );
        }
      } catch (error) {
        console.error('Error sending maintenance email:', error);
      }
    }

    return { success: true, isActive: this.isMaintenanceActive };
  }

  getWhitelistedIps(): string[] {
    return Array.from(this.whitelistedIpsCache);
  }

  isWhitelistedIp(ip: string): boolean {
    return this.whitelistedIpsCache.has(ip);
  }

  getWhiteListUsers(): string[] {
    return Array.from(this.maintenanceUsersCache);
  }

  isMaintenanceUser(userId: string): boolean {
    return this.maintenanceUsersCache.has(userId);
  }

  async addWhitelistedIp(ip: string, description?: string) {
    const existing = await this.maintenanceIpRepo.findOne({ where: { ip } });
    if (!existing) {
      await this.maintenanceIpRepo.save({ ip, description });
      this.whitelistedIpsCache.add(ip);
    }
    return { success: true, ip };
  }

  async addWhitelistedUser(userId: string) {
    const existing = await this.maintenanceUserRepo.findOne({
      where: { userId },
    });
    if (!existing) {
      await this.maintenanceUserRepo.save({ userId });
      this.maintenanceUsersCache.add(userId);
    }
    return { success: true, userId };
  }

  async removeWhitelistedIp(ip: string) {
    await this.maintenanceIpRepo.delete({ ip });
    this.whitelistedIpsCache.delete(ip);
    return { success: true };
  }
}
