import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
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
    await app.init();
  });

  afterAll(async () => {
    await mongoServer.stop();
    await app.close();
  });

  describe('as a Public user to', () => {
    const everyoneToken = {};

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'Everyone', password: 'public' });
      everyoneToken['Authorization'] = `Bearer ${response.body.access_token}`;
    });

    it('/monsters [GET] should retrieve a list of monster', async () => {
      const response = await request(app.getHttpServer()).get('/monster').set(everyoneToken);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('/monsters [POST] should be forbidden', async () => {
      const response = await request(app.getHttpServer()).post('/monster').set(everyoneToken).send({ name: 'Test' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden', message: 'Forbidden resource', statusCode: 403 });
    });

    it('/monsters [PUT] should be forbidden', async () => {
      const response = await request(app.getHttpServer()).put('/monster').set(everyoneToken).send({ name: 'Test' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden', message: 'Forbidden resource', statusCode: 403 });
    });

    it('/monsters [DELETE] should be forbidden', async () => {
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
