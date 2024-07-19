import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { RoleEnum } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

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
      (await this.isTokenValid(context)) ||
      (await this.isUserHasRequiredRoles(context))
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
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      request['user'] = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
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
    const user: UserEntity = await this.userService.findById(payload.sub);
    const roleName = user.role?.roleName?.toUpperCase();

    return requiredRoles.includes(roleName as RoleEnum);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}