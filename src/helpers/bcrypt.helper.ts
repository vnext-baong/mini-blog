import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class PasswordHelper {
  private readonly saltRounds: number = 10;

  encryptPassword(password: string): string {
    return hashSync(password, this.saltRounds);
  }

  comparePassword(input: string, hashed: string): boolean {
    return compareSync(input, hashed);
  }
}
