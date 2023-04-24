import { Test, TestingModule } from '@nestjs/testing';
import { MonsterController } from './monster.controller';
import { MonsterService } from './monster.service';
import { getModelToken } from '@nestjs/mongoose';
import { MonsterRepository } from './monster.repository';
import { Monster } from './entity/monster.entity';

describe('MonsterController', () => {
  let controller: MonsterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonsterController],
      providers: [
        MonsterService,
        MonsterRepository,
        {
          provide: getModelToken(Monster.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MonsterController>(MonsterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
