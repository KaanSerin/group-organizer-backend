import { Module } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { GroupsProtectedController } from './groups-protected.controller';

@Module({
  providers: [GroupsService],
  controllers: [GroupsProtectedController],
})
export class GroupsProtectedModule {}
