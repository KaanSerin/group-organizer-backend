import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRoleType } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.users();
  }

  @Get('roles')
  async userRoles(): Promise<UserRoleType[]> {
    return this.userService.userRoleTypes();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<User | null> {
    return this.userService.user(Number(id));
  }
}
