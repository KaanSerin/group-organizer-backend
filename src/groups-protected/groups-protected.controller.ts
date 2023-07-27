import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
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
  async getEvents(
    @Param('id') id: string,
    @Query('pageLength', new DefaultValuePipe(5), ParseIntPipe)
    pageLength: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.groupService.getEventsPaginatedForGroupId(
      Number(id),
      pageLength,
      cursor ? Number(cursor) : undefined,
    );
  }

  @Post('events')
  async createEvent(
    @Req() req: RequestWithUser,
    @Body() body: CreateGroupEventDto,
  ) {
    return this.groupService.createGroupEvent(req.user, body);
  }

  @Get(':id/members')
  async getMembers(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('pageLength', new DefaultValuePipe(15), ParseIntPipe)
    pageLength: number,
  ) {
    return this.groupService.getMembersPaginatedForGroupId(
      id,
      page,
      pageLength,
    );
  }

  @Get('upcoming_events')
  async getUpcomingEvents(
    @Req() req,
    @Query('pageLength', new DefaultValuePipe(5), ParseIntPipe)
    pageLength: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.groupService.getUpcomingEventsPaginated(
      req.user.id,
      pageLength,
      cursor ? Number(cursor) : undefined,
    );
  }
}
