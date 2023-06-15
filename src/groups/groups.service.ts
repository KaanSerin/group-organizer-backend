import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Group, GroupEvent } from '@prisma/client';
import { CreateGroupDto, JoinGroupDto } from '../validators';
import { UserGroupResponse } from '../../types/types';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroups(): Promise<Group[]> {
    return this.prisma.group.findMany();
  }

  async getGroup(id: number): Promise<Group & { groupEvents: GroupEvent[] }> {
    return this.prisma.group.findFirst({
      where: { id },
      include: {
        groupEvents: {
          take: 10,
        },
      },
    });
  }

  async createGroup(data: CreateGroupDto): Promise<Group> {
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

  async getGroupsByUserId(userId: number): Promise<UserGroupResponse[]> {
    const userGroups = await this.prisma.userGroup.findMany({
      where: {
        userId,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            createdBy: true,
            createdAt: false,
            updatedAt: false,
            bannerImageUrl: true,
            isActive: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
      },
    });

    return userGroups.map((userGroup) => {
      const group = userGroup.group;
      const isOwner = group.createdBy === userId;
      delete group.createdBy;

      const members = group._count.users;
      delete group._count;
      return {
        ...group,
        isOwner,
        joined: true,
        members,
      };
    });
  }

  async getEventsPaginatedForGroupId(groupId: number, cursor?: number) {
    return this.prisma.groupEvent.findMany({
      take: 10,
      cursor: {
        id: cursor,
      },
      where: {
        groupId: groupId,
      },
    });
  }
}
