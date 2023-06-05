import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, LoginUserDto } from '../validators';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(
    data: LoginUserDto,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload = { id: user.id, username: user.username };
    delete user.password;
    return { access_token: await this.jwtService.signAsync(payload), user };
  }

  async register(data: CreateUserDto) {
    const emailInUse = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailInUse) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    const usernameInUse = await this.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });

    if (usernameInUse) {
      throw new HttpException(
        'Username already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = await this.prisma.userRoleType.findFirst({
      where: {
        id: data.roleId,
      },
    });

    if (!role) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: await bcrypt.hash(data.password, 10),
          roleId: role.id,
        },
      });

      const payload = { id: user.id, username: user.username };
      return { access_token: await this.jwtService.signAsync(payload) };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
