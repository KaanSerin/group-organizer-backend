import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Group, GroupEvent, User } from '@prisma/client';
import {
  CreateGroupDto,
  CreateGroupEventDto,
  JoinGroupDto,
} from '../validators';
import {
  GroupEventResponse,
  PaginatedResponse,
  UserGroupResponse,
} from '../../types/types';

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

  async getEventsPaginatedForGroupId(
    groupId: number,
    pageLength: number,
    cursor?: number,
  ): Promise<GroupEventResponse[]> {
    const queryArgs = {
      take: pageLength,
      where: {
        groupId: groupId,
      },
    };

    if (cursor) {
      queryArgs['cursor'] = {
        id: cursor,
      };
    }

    const groupEvents = await this.prisma.groupEvent.findMany({
      ...queryArgs,
      include: {
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
            profilePicUrl: true,
          },
        },
      },
    });

    return groupEvents.map((groupEvent) => ({
      id: groupEvent.id,
      name: groupEvent.name,
      isActive: groupEvent.isActive,
      eventDate: groupEvent.eventDate,
      eventImageUrl: groupEvent.eventImageUrl,
      createUserId: groupEvent.createdBy,
      createUserName: `${groupEvent.createdByUser.firstName} ${groupEvent.createdByUser.lastName}`,
      createUserImageUrl: groupEvent.createdByUser.profilePicUrl,
    }));
  }

  async createGroupEvent(user: User, data: CreateGroupEventDto) {
    const group = await this.prisma.group.findFirst({
      where: {
        id: data.groupId,
      },
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.BAD_REQUEST);
    }

    const userGroup = await this.prisma.userGroup.findFirst({
      where: {
        userId: user.id,
        groupId: data.groupId,
      },
    });

    if (!userGroup) {
      throw new HttpException('User not in group', HttpStatus.UNAUTHORIZED);
    }

    const userGroupRole = await this.prisma.groupRoleType.findFirst({
      where: {
        id: userGroup.userRoleId,
      },
    });

    if (!userGroupRole.isAdmin) {
      throw new HttpException(
        'User not admin of group',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.prisma.groupEvent.create({
        data: {
          ...data,
          eventDate: new Date(data.eventDate),
          eventImageUrl: group.bannerImageUrl,
          createdBy: user.id,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Error creating event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMembersPaginatedForGroupId(
    groupId: number,
    page: number,
    pageLength: number,
  ): Promise<PaginatedResponse<User>> {
    try {
      const [count, users] = await this.prisma.$transaction([
        this.prisma.userGroup.count({
          where: {
            groupId,
          },
        }),
        this.prisma.userGroup.findMany({
          where: {
            groupId,
          },
          include: {
            user: true,
          },
          skip: page * pageLength,
          take: pageLength,
          orderBy: {
            userId: 'asc',
          },
        }),
      ]);

      return {
        data: users.map((groupMember) => {
          const user = groupMember.user;
          delete user.password;
          return user;
        }),
        meta: {
          total: count,
          page,
          pageLength,
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getUpcomingEventsPaginated(
    userId: number,
    pageLength: number,
    cursor?: number,
  ): Promise<GroupEventResponse[]> {
    const queryArgs = {
      take: pageLength,
    };
    if (cursor) {
      queryArgs['cursor'] = {
        id: cursor,
      };
    }

    const userGroups = await this.prisma.userGroup.findMany({
      where: {
        userId,
      },
      include: {
        group: {
          include: {
            groupEvents: {
              ...queryArgs,
              include: {
                createdByUser: {
                  select: {
                    firstName: true,
                    lastName: true,
                    profilePicUrl: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicUrl: true,
          },
        },
      },
    });

    let events = [];

    userGroups.forEach((userGroup) => {
      events = [
        ...events,
        ...userGroup.group.groupEvents.map((groupEvent) => ({
          id: groupEvent.id,
          name: groupEvent.name,
          isActive: groupEvent.isActive,
          eventDate: groupEvent.eventDate,
          eventImageUrl: groupEvent.eventImageUrl,
          createUserId: groupEvent.createdBy,
          createUserName: `${groupEvent.createdByUser.firstName} ${groupEvent.createdByUser.lastName}`,
          createUserImageUrl: groupEvent.createdByUser.profilePicUrl,
        })),
      ];
    });

    return events;
  }
}
