import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/utils/i.jwtPayload';
import { IS_PUBLIC_KEY } from '../utils/public.decorator';
import { RoleEnum } from '../utils/role.enum';
import { ROLES_KEY } from '../utils/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (
      (await this.isPublicRoute(context)) ||
      ((await this.isTokenValid(context)) && (await this.isUserHasRequiredRoles(context)))
    );
  }

  private async isPublicRoute(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic || false;
  }

  private async isTokenValid(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;

      return true;
    } catch (error) {
      switch (error.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Token expired');

        default:
          throw new UnauthorizedException('Invalid token');
      }
    }
  }

  private async isUserHasRequiredRoles(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request['user'];
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return !requiredRoles || this.isUserInRequiredRoles(payload, requiredRoles);
  }

  private async isUserInRequiredRoles(payload: any, requiredRoles: RoleEnum[]): Promise<boolean> {
    const user = await this.userService.findById(payload.userId);
    if (!user.status) {
      throw new UnauthorizedException('Your account is not active');
    }

    const roleName = user.role?.roleName?.toUpperCase();

    return requiredRoles.includes(roleName as RoleEnum);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
