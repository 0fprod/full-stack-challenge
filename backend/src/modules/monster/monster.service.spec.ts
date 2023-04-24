import { Test, TestingModule } from '@nestjs/testing';
import { MonsterService } from './monster.service';
import { getModelToken } from '@nestjs/mongoose';
import { MonsterRepository } from './monster.repository';
import { Monster } from './entity/monster.entity';

const mockMonster: Monster = {
  id: 'anId',
  name: { first: 'Niamh', last: 'Dragon', title: 'Ms' },
  gender: 'female',
  description: 'irrelevant description',
  nationality: ['IE', 'IN'],
  imageUrl: '',
  goldBalance: 100,
  speed: 60,
  health: 95,
  secretNotes: 'Can be found in the misty hills of Connemara',
  monsterPassword: 'niamh1234',
};

const monsterArray: Array<Monster> = [
  {
    id: 'anId',
    name: { first: 'Lei', last: 'Dragon', title: 'Ms' },
    gender: 'female',
    description: 'irrelevant description',
    nationality: ['CN', 'BR'],
    imageUrl: '',
    goldBalance: 150,
    speed: 70,
    health: 105,
    secretNotes: 'Can be found in the eye of the storm',
    monsterPassword: 'lei7890',
  },
  {
    id: 'anotherId',
    name: { first: 'Erik', last: 'Dragon', title: 'Mr' },
    gender: 'male',
    description: 'irrelevant description',
    nationality: ['SE', 'PE'],
    imageUrl: '',
    goldBalance: 250,
    speed: 65,
    health: 110,
    secretNotes: 'Can be found in the heart of the Amazon rainforest',
    monsterPassword: 'erik2468',
  },
];

describe('MonsterService', () => {
  let service: MonsterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MonsterRepository,
          useValue: {
            findAll: jest.fn().mockReturnValue(monsterArray),
            create: jest.fn().mockReturnValue(mockMonster),
          },
        },
        MonsterService,
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

    service = module.get<MonsterService>(MonsterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of monsters', async () => {
    const monsters = await service.findAll();
    expect(monsters).toEqual(monsterArray);
  });

  it('should create a monster', async () => {
    const newMonster = await service.create({} as any);
    expect(newMonster).toEqual(mockMonster);
  });
});
