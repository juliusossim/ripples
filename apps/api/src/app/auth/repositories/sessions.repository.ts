import { Injectable } from '@nestjs/common';
import type { AuthSession } from '@org/types';
import { PrismaService } from '../../database/prisma.service';

interface SessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, refreshTokenHash: string, expiresAt: Date): Promise<AuthSession> {
    const session = await this.prisma.authSession.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
    });

    return this.toAuthSession(session);
  }

  async findActiveByRefreshTokenHash(refreshTokenHash: string): Promise<AuthSession | undefined> {
    const session = await this.prisma.authSession.findFirst({
      where: {
        refreshTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return session ? this.toAuthSession(session) : undefined;
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.authSession.updateMany({
      where: {
        id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private toAuthSession(session: SessionRecord): AuthSession {
    return {
      id: session.id,
      userId: session.userId,
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt ?? undefined,
      createdAt: session.createdAt,
    };
  }
}
