import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { AuthConfigService } from './auth-config.service';

const scryptAsync = promisify(scrypt);
const keyLength = 64;

@Injectable()
export class PasswordService {
  constructor(private readonly config: AuthConfigService) {}

  async hash(password: string): Promise<{ hash: string; salt: string }> {
    const salt = randomBytes(16).toString('base64url');
    const hash = await this.derive(password, salt);

    return { hash, salt };
  }

  async verify(password: string, salt: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.derive(password, salt);
    const actual = Buffer.from(actualHash, 'base64url');
    const expected = Buffer.from(expectedHash, 'base64url');

    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }

  private async derive(password: string, salt: string): Promise<string> {
    const derived = (await scryptAsync(
      `${password}${this.config.passwordPepper}`,
      salt,
      keyLength,
    )) as Buffer;

    return derived.toString('base64url');
  }
}
