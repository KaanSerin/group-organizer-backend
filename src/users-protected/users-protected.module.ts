import { Module } from '@nestjs/common';
import { UsersProtectedController } from './users-protected.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
  ],
  controllers: [UsersProtectedController],
})
export class UsersProtectedModule {}
