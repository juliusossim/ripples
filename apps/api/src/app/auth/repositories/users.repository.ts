import { ConflictException, Injectable } from '@nestjs/common';
import { AuthProvider, Prisma, UserRole } from '@prisma/client';
import type {
  AuthProvider as PublicAuthProvider,
  AuthUser,
  UserRole as PublicUserRole,
} from '@org/types';
import type { CreateManualUserInput, StoredUser, UpsertGoogleUserInput } from '../auth.types';
import { PrismaService } from '../../database/prisma.service';

type StoredUserRecord = Prisma.AuthUserGetPayload<{
  include: {
    accounts: true;
  };
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createManual(input: CreateManualUserInput): Promise<StoredUser> {
    const email = this.normalizeEmail(input.email);

    try {
      const user = await this.prisma.authUser.create({
        data: {
          email,
          fullName: input.fullName.trim(),
          roles: [UserRole.user],
          emailVerified: false,
          accounts: {
            create: {
              provider: AuthProvider.manual,
              providerUserId: email,
              passwordHash: input.passwordHash,
              passwordSalt: input.passwordSalt,
            },
          },
        },
        include: {
          accounts: true,
        },
      });

      return this.toStoredUser(user);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('An account already exists for this email address.');
      }

      throw error;
    }
  }

  async upsertGoogle(input: UpsertGoogleUserInput): Promise<StoredUser> {
    const email = this.normalizeEmail(input.email);
    const existingByGoogle = await this.findByAccount(AuthProvider.google, input.googleSubject);
    if (existingByGoogle) {
      return this.updateGoogleUser(existingByGoogle.id, input);
    }

    const existingByEmail = await this.findByEmail(email);
    if (existingByEmail) {
      return this.updateGoogleUser(existingByEmail.id, input);
    }

    const user = await this.prisma.authUser.create({
      data: {
        email,
        fullName: input.fullName.trim(),
        avatarUrl: input.avatarUrl,
        roles: [UserRole.user],
        emailVerified: input.emailVerified,
        accounts: {
          create: {
            provider: AuthProvider.google,
            providerUserId: input.googleSubject,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    return this.toStoredUser(user);
  }

  async findById(id: string): Promise<StoredUser | undefined> {
    const user = await this.prisma.authUser.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    return user ? this.toStoredUser(user) : undefined;
  }

  async findByEmail(email: string): Promise<StoredUser | undefined> {
    const user = await this.prisma.authUser.findUnique({
      where: {
        email: this.normalizeEmail(email),
      },
      include: {
        accounts: true,
      },
    });

    return user ? this.toStoredUser(user) : undefined;
  }

  toPublicUser(user: StoredUser): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      providers: user.providers,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async updateGoogleUser(
    userId: string,
    input: UpsertGoogleUserInput,
  ): Promise<StoredUser> {
    const user = await this.prisma.authUser.update({
      where: { id: userId },
      data: {
        fullName: input.fullName.trim(),
        avatarUrl: input.avatarUrl,
        emailVerified: input.emailVerified,
        accounts: {
          upsert: {
            where: {
              provider_providerUserId: {
                provider: AuthProvider.google,
                providerUserId: input.googleSubject,
              },
            },
            create: {
              provider: AuthProvider.google,
              providerUserId: input.googleSubject,
            },
            update: {
              providerUserId: input.googleSubject,
            },
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    return this.toStoredUser(user);
  }

  private async findByAccount(
    provider: AuthProvider,
    providerUserId: string,
  ): Promise<StoredUser | undefined> {
    const account = await this.prisma.authAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      include: {
        user: {
          include: {
            accounts: true,
          },
        },
      },
    });

    return account ? this.toStoredUser(account.user) : undefined;
  }

  private toStoredUser(user: StoredUserRecord): StoredUser {
    const manualAccount = user.accounts.find((account) => account.provider === AuthProvider.manual);
    const googleAccount = user.accounts.find((account) => account.provider === AuthProvider.google);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl ?? undefined,
      roles: user.roles.map((role) => this.toPublicRole(role)),
      providers: user.accounts.map((account) => this.toPublicProvider(account.provider)),
      emailVerified: user.emailVerified,
      passwordHash: manualAccount?.passwordHash ?? undefined,
      passwordSalt: manualAccount?.passwordSalt ?? undefined,
      googleSubject: googleAccount?.providerUserId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private toPublicProvider(provider: AuthProvider): PublicAuthProvider {
    return provider === AuthProvider.google ? 'google' : 'manual';
  }

  private toPublicRole(role: UserRole): PublicUserRole {
    return role === UserRole.admin ? 'admin' : 'user';
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
