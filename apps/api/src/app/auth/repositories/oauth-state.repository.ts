import { Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import type { OAuthStateRecord } from '../auth.types';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OAuthStateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(record: OAuthStateRecord): Promise<OAuthStateRecord> {
    await this.deleteExpired();
    const created = await this.prisma.oAuthState.create({
      data: {
        state: record.state,
        codeVerifier: record.codeVerifier,
        redirectUri: record.redirectUri,
        provider: AuthProvider.google,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
      },
    });

    return {
      state: created.state,
      codeVerifier: created.codeVerifier,
      redirectUri: created.redirectUri,
      provider: 'google',
      expiresAt: created.expiresAt,
      createdAt: created.createdAt,
    };
  }

  async consume(state: string): Promise<OAuthStateRecord | undefined> {
    await this.deleteExpired();
    const record = await this.prisma.oAuthState.findUnique({
      where: { state },
    });
    if (!record) {
      return undefined;
    }

    await this.prisma.oAuthState.delete({
      where: { state },
    });

    return {
      state: record.state,
      codeVerifier: record.codeVerifier,
      redirectUri: record.redirectUri,
      provider: 'google',
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
    };
  }

  private async deleteExpired(): Promise<void> {
    await this.prisma.oAuthState.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  }
}
