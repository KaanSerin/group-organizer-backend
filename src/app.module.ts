import { Module } from '@nestjs/common';
import { GlobalsModule } from './globals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersProtectedModule } from './users-protected/users-protected.module';
import { GroupsModule } from './groups/groups.module';
import { GroupsProtectedModule } from './groups-protected/groups-protected.module';

@Module({
  imports: [
    GlobalsModule,
    UsersProtectedModule,
    UsersModule,
    AuthModule,
    GroupsProtectedModule,
    GroupsModule,
  ],
})
export class AppModule {}
