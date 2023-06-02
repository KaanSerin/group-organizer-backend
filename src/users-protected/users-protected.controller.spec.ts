import { Test, TestingModule } from '@nestjs/testing';
import { UsersProtectedController } from './users-protected.controller';

describe('UsersProtectedController', () => {
  let controller: UsersProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersProtectedController],
    }).compile();

    controller = module.get<UsersProtectedController>(UsersProtectedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
