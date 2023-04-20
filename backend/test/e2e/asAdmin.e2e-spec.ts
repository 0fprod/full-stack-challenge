import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

describe('E2E: Requests', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

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

    it('/monsters [GET] should retrieve a list of monster', async () => {
      const response = await request(app.getHttpServer()).get('/monster').set(everyoneToken);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('/monsters [POST] should not create invalid monsters', async () => {
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

    it('/monsters [POST] should create a valid monster', async () => {
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

    it('/monsters [PATCH] should not modify invalid monsters', async () => {
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

    it('/monsters [PATCH] cant modify an unexisting monster', async () => {
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

    it.only('/monsters [PATCH] should modify a monster', async () => {
      const validMonsterDto = {
        title: 'Mr',
        firstName: 'Test',
        nationality: ['ES'],
      };
      const createMonsterResponse = await request(app.getHttpServer())
        .post('/monster')
        .set(everyoneToken)
        .send(validMonsterDto);
      console.log('🚀 ~ createMonsterResponse:', createMonsterResponse.body.id);

      const updateMonsterDto = {
        id: createMonsterResponse.body.id,
        title: 'Mrs',
      };
      const response = await request(app.getHttpServer()).patch('/monster').set(everyoneToken).send(updateMonsterDto);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: updateMonsterDto.id,
        name: { title: 'Mrs', first: 'Test' },
        nationality: ['ES'],
      });
    });

    it.skip('/monsters [DELETE] should be forbidden', async () => {
      const response = await request(app.getHttpServer()).delete('/monster').set(everyoneToken).send({ name: 'Test' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden', message: 'Forbidden resource', statusCode: 403 });
    });

    it.skip('/update-gold [POST] should be forbidden', async () => {
      const response = await request(app.getHttpServer())
        .post('/update-gold')
        .set(everyoneToken)
        .send({ name: 'Test' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden', message: 'Forbidden resource', statusCode: 403 });
    });
  });
});
