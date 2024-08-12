import { Injectable } from '@nestjs/common';
import { RoleEntity, UserEntity } from 'src/entities';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { encodePassword } from 'src/utils/bcrypt';
import { RoleEnum } from 'src/utils/role.enum';

@Injectable()
export class DatabaseSeederService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async seed() {
    await this.seedRoles();
    await this.seedUsers();
  }

  private async seedRoles() {
    const roles: RoleEntity[] = [];
    for (const roleName of Object.values(RoleEnum)) {
      const existingRole = await this.roleService.findByName(roleName);
      if (!existingRole) {
        const role = new RoleEntity();
        role.roleName = roleName;
        roles.push(role);
      }
    }

    await this.roleService.store(roles);
  }

  private async seedUsers() {
    const existingAdmin = await this.userService.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!existingAdmin) {
      const user = new UserEntity();

      user.email = process.env.ADMIN_EMAIL;
      user.password = encodePassword(process.env.ADMIN_PASSWORD);
      user.fullName = 'Admin';
      user.role = await this.roleService.findByName(RoleEnum.ADMIN);

      await this.userService.store(user);
    }
  }
}
