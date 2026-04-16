import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { AuthenticatedRequest } from '../auth.types';

interface HeaderRequest extends AuthenticatedRequest {
  header(name: string): string | undefined;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HeaderRequest>();
    const authorization = request.header('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    request.user = this.authService.verifyAccessToken(authorization.slice('Bearer '.length));
    return true;
  }
}
