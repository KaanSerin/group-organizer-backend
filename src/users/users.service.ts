import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRoleType } from '@prisma/client';

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

  async userRoleTypes(): Promise<UserRoleType[]> {
    return this.prisma.userRoleType.findMany();
  }

  async updateUser(user: User): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        bio: user.bio,
        phone: user.phone,
      },
    });
  }
}
