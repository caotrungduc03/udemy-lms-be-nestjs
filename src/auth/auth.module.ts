import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity, UserEntity } from 'src/entities';
import { RoleService } from 'src/role/role.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, RoleService],
})
export class AuthModule {}
