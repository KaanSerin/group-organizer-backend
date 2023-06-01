import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserValidator } from '../validators';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: CreateUserValidator) {
    return data;
  }
}
