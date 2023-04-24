import { Monster } from '../../src/modules/monster/entity/monster.entity';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { UpdateMonsterDTO } from '../../src/modules/monster/dto';

describe('E2E: Requests', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let dbModel: Model<Monster>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), AppModule],
    })
      .overrideProvider('MONGO_URI')
      .useValue(uri)
      .compile();

    app = moduleFixture.createNestApplication();
    dbModel = moduleFixture.get<Model<Monster>>(getModelToken(Monster.name));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await mongoServer.stop();
    await app.close();
  });

  describe('as an Admin user to', () => {
    const everyoneToken = {};

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'Bored Mike', password: 'mike' });
      everyoneToken['Authorization'] = `Bearer ${response.body.access_token}`;
    });

    afterEach(async () => {
      await dbModel.deleteMany({});
    });

    it('/monster [POST] should not create invalid monsters', async () => {
      const invalidMonsterDto = {
        title: 'Mr',
        firstName: 'Test',
        nationality: ['INVALID_NATIONALITY'],
      };

      const response = await request(app.getHttpServer()).post('/monster').set(everyoneToken).send(invalidMonsterDto);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: ['each value in nationality must be shorter than or equal to 2 characters'],
        statusCode: 400,
      });
    });

    it('/monster [POST] should create a valid monster', async () => {
      const validMonsterDto = {
        title: 'Mr',
        firstName: 'Test',
        nationality: ['ES'],
      };

      const response = await request(app.getHttpServer()).post('/monster').set(everyoneToken).send(validMonsterDto);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: { title: 'Mr', first: 'Test' },
        nationality: ['ES'],
      });
    });

    it('/monster [GET] should retrieve a list of monster', async () => {
      await saveMonster({
        name: {
          first: 'test',
          title: 'Mr',
          last: 'irrelevant',
        },
      });

      const response = await request(app.getHttpServer()).get('/monster').set(everyoneToken);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('/monster [GET] should retrieve a paginated list of monster', async () => {
      await saveManyMonsters([
        {
          name: {
            title: 'Mr',
            first: 'aName',
            last: 'irrelevant',
          },
        },
        {
          name: {
            title: 'Mr',
            first: 'anotherName',
            last: 'irrelevant',
          },
        },
        {
          name: {
            title: 'Mr',
            first: 'aDifferentName',
            last: 'irrelevant',
          },
        },
        {
          name: {
            title: 'Mr',
            first: 'aRandomName',
            last: 'irrelevant',
          },
        },
      ]);

      const firstTwo = await request(app.getHttpServer()).get('/monster').set(everyoneToken).query({
        skip: 0,
        limit: 2,
      });

      const lastTwo = await request(app.getHttpServer()).get('/monster').set(everyoneToken).query({
        skip: 2,
        limit: 2,
      });

      expect(firstTwo.status).toBe(200);
      expect(lastTwo.status).toBe(200);
      expect(firstTwo.body).toHaveLength(2);
      expect(lastTwo.body).toHaveLength(2);
      expect(firstTwo.body[0].name.first).toEqual('aName');
      expect(lastTwo.body[0].name.first).toEqual('aDifferentName');
    });

    it('/monster [PATCH] should not modify invalid monsters', async () => {
      const updateMonsterDtoWithoutId = {
        title: 'Mr',
      };
      const response = await request(app.getHttpServer())
        .patch('/monster')
        .set(everyoneToken)
        .send(updateMonsterDtoWithoutId);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: ['id should not be empty', 'id must be a string'],
        statusCode: 400,
      });
    });

    it('/monster [PATCH] cant modify an unexisting monster', async () => {
      const updateMonsterDto = {
        id: '64417380f8799e1a9b4fb823',
        title: 'Mrs',
      };
      const response = await request(app.getHttpServer()).patch('/monster').set(everyoneToken).send(updateMonsterDto);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Monster doesnt exist, review the monster id.',
        statusCode: 404,
      });
    });

    it("/monster [PATCH] cant modify a monster's gold balance", async () => {
      const { id } = await saveMonster({
        name: {
          first: 'Test',
          title: 'Mr',
          last: null,
        },
        nationality: ['ES'],
      });
      const updateMonsterDto = new UpdateMonsterDTO();
      updateMonsterDto.id = id;
      updateMonsterDto.firstName = 'Mrs';
      const response = await request(app.getHttpServer())
        .patch('/monster')
        .set(everyoneToken)
        .send({
          ...updateMonsterDto,
          goldBalance: 300,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: ['property goldBalance should not exist'],
        statusCode: 400,
      });
    });

    it('/monster [PATCH] should modify a monster', async () => {
      const { id } = await saveMonster({
        name: {
          first: 'Test',
          title: 'Mr',
          last: null,
        },
        nationality: ['ES'],
      });
      const updateMonsterDto = {
        id,
        title: 'Mrs',
      };
      const response = await request(app.getHttpServer()).patch('/monster').set(everyoneToken).send(updateMonsterDto);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: updateMonsterDto.id,
        name: { title: 'Mrs', first: 'Test', last: null },
        nationality: ['ES'],
      });
    });

    it('/monster [DELETE] should delete a monster', async () => {
      const validMonsterDto = {
        title: 'Mr',
        firstName: 'Test',
        nationality: ['ES'],
      };
      const { id } = await saveMonster(validMonsterDto);

      const response = await request(app.getHttpServer()).delete('/monster').set(everyoneToken).query({ id });

      expect(response.status).toBe(200);

      const getAllMonsters = await request(app.getHttpServer()).get('/monster').set(everyoneToken);
      expect(getAllMonsters.status).toBe(200);
      expect(getAllMonsters.body).toEqual([]);
    });

    it.skip('/update-gold [POST] should be forbidden', async () => {
      const response = await request(app.getHttpServer())
        .post('/update-gold')
        .set(everyoneToken)
        .send({ name: 'Test' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden', message: 'Forbidden resource', statusCode: 403 });
    });

    async function saveMonster(monster: Partial<Monster>): Promise<Monster> {
      return await new dbModel(monster).save();
    }

    async function saveManyMonsters(monsters: Array<Partial<Monster>>): Promise<number> {
      await dbModel.insertMany(monsters);
      return monsters.length;
    }
  });
});
