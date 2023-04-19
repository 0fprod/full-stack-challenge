import { Test, TestingModule } from '@nestjs/testing';
import { MonsterService } from './monster.service';
import { getModelToken } from '@nestjs/mongoose';
import { Monster } from './schema/monster.schema';
import { Model } from 'mongoose';

const mockMonster: Monster = {
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
  let model: Model<Monster>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
    model = module.get<Model<Monster>>(getModelToken(Monster.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of monsters', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(monsterArray),
    } as any);
    const monsters = await service.findAll();
    expect(monsters).toEqual(monsterArray);
  });

  it('should create a monster', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve({ ...mockMonster } as any));
    const newMonster = await service.create({} as any);
    expect(newMonster).toEqual(mockMonster);
  });
});
