import { Module } from '@nestjs/common';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { DatabaseSeederService } from './database-seeder.service';

@Module({
  imports: [UserModule, RoleModule],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
