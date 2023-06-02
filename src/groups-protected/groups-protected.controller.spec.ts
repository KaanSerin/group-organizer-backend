import { Test, TestingModule } from '@nestjs/testing';
import { GroupsProtectedController } from './groups-protected.controller';

describe('GroupsProtectedController', () => {
  let controller: GroupsProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsProtectedController],
    }).compile();

    controller = module.get<GroupsProtectedController>(GroupsProtectedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
