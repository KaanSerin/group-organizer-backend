import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRoleType } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('roles')
  async userRoles(): Promise<UserRoleType[]> {
    return this.userService.userRoleTypes();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<User | null> {
    return this.userService.user(Number(id));
  }
}
