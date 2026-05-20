import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('status')
  getStatus() {
    return { isActive: this.maintenanceService.getStatus() };
  }
  @JwtAuth()
  @Get('whitelist-ips')
  async getWhitelistedIps() {
    const ips = await this.maintenanceService.getWhitelistedIps();
    return { ips };
  }
  @JwtAuth()
  @Get('whitelist-users')
  async getWhiteListUsers() {
    const users = await this.maintenanceService.getWhiteListUsers();
    return { users };
  }

  @JwtAuth()
  @Roles('admin')
  @Post('toggle')
  async toggleMaintenance(@Body('isActive') isActive: boolean) {
    return await this.maintenanceService.toggleMaintenance(isActive);
  }
  @JwtAuth()
  @Post('whitelist-ip')
  async addWhitelistIp(
    @Body('ip') ip: string,
    @Body('description') description: string,
  ) {
    return await this.maintenanceService.addWhitelistedIp(ip, description);
  }
  @JwtAuth()
  @Post('whitelist-user')
  async addWhitelistUser(@Body('userId') userId: string) {
    return await this.maintenanceService.addWhitelistedUser(userId);
  }
  @JwtAuth()
  @Delete('whitelist-ip/remove/:ip')
  async removeWhitelistIp(@Param('ip') ip: string) {
    return await this.maintenanceService.removeWhitelistedIp(ip);
  }
}
