import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersProtectedController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.users();
  }
}
