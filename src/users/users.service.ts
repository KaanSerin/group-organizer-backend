import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  }
  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async userRoles(): Promise<UserRole[]> {
    return this.prisma.userRole.findMany();
  }
}
