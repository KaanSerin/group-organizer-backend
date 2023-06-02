import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { CreateGroupDto } from '../validators';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsProtectedController {
  constructor(private groupService: GroupsService) {}

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
}
