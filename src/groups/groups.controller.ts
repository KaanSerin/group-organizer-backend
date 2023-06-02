import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return this.groupService.getGroup(Number(id));
  }
}
