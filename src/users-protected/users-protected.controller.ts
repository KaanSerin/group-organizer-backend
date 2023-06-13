import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersProtectedController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.users();
  }

  @Put()
  async updateUser(@Req() req: Request, @Body() body: User): Promise<User> {
    return this.userService.updateUser(body);
  }
}
