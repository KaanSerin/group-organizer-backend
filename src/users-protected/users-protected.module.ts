import { Module } from '@nestjs/common';
import { UsersProtectedController } from './users-protected.controller';
import { UsersService } from '../users/users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersProtectedController],
})
export class UsersProtectedModule {}
