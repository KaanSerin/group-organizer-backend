import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { CreateGroupDto, CreateGroupEventDto } from '../validators';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { RequestWithUser } from '../../types/types';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsProtectedController {
  constructor(private groupService: GroupsService) {}

  @Get('user_groups')
  async getGroup(@Req() req: Request, @Param('id') id: string) {
    return this.groupService.getGroupsByUserId(req['user']['id']);
  }

  @Get()
  async getGroups() {
    return this.groupService.getGroups();
  }

  @Post()
  async createGroup(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup({
      ...createGroupDto,
      createdBy: req.user.id,
    });
  }

  @Post('join')
  async joinGroup(@Query('id') id, @Req() req) {
    return this.groupService.joinGroup({
      groupId: Number(1),
      userId: req.user.id,
    });
  }

  @Get(':id/events')
  async getEvents(@Param('id') id: string, @Query('cursor') cursor: string) {
    return this.groupService.getEventsPaginatedForGroupId(
      Number(id),
      Number(cursor),
    );
  }

  @Post('events')
  async createEvent(
    @Req() req: RequestWithUser,
    @Body() body: CreateGroupEventDto,
  ) {
    return this.groupService.createGroupEvent(req.user, body);
  }
}
