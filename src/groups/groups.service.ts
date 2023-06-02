import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Group } from '@prisma/client';
import { JoinGroupDto } from '../validators';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroups(): Promise<Group[]> {
    return this.prisma.group.findMany();
  }

  async getGroup(id: number): Promise<Group | null> {
    return this.prisma.group.findFirst({
      where: { id },
    });
  }

  async createGroup(data): Promise<Group> {
    const group = await this.prisma.group.create({
      data,
    });

    const groupMemberType = await this.prisma.groupRoleType.findFirst({
      where: {
        name: 'group_owner',
      },
    });

    if (!groupMemberType) {
      throw new Error('Group member type not found');
    }

    console.log(group, groupMemberType);

    await this.prisma.userGroup.create({
      data: {
        groupId: group.id,
        userId: data.createdBy,
        userRoleId: groupMemberType.id,
      },
    });

    return group;
  }

  async joinGroup(data: JoinGroupDto) {
    const groupMemberType = await this.prisma.groupRoleType.findFirst({
      where: {
        name: 'group_member',
      },
    });

    if (!groupMemberType) {
      throw new Error('Group member type not found');
    }

    console.log(groupMemberType);

    return this.prisma.userGroup.create({
      data: {
        userId: data.userId,
        groupId: data.groupId,
        userRoleId: groupMemberType.id,
      },
    });
  }
}
