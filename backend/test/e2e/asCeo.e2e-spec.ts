import { Vote } from '../../src/modules/vote/entity/vote.entity';
import { Monster } from '../../src/modules/monster/entity/monster.entity';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { Model } from 'mongoose';

describe('E2E: Requests', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let dbVoteModel: Model<Vote>;
  let dbMonsterModel: Model<Monster>;

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
    dbVoteModel = moduleFixture.get<Model<Vote>>(getModelToken(Vote.name));
    dbMonsterModel = moduleFixture.get<Model<Monster>>(getModelToken(Monster.name));

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

  describe('as an CEO user to', () => {
    const ceoToken = {};

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'ceo', password: 'ceo' });
      ceoToken['Authorization'] = `Bearer ${response.body.access_token}`;
    });

    afterEach(async () => {
      await dbVoteModel.deleteMany({});
    });

    it('/vote/start [POST] should start a voting session ', async () => {
      const response = await request(app.getHttpServer()).post('/vote/start').set(ceoToken).send();
      const session = await dbVoteModel.find({}).exec();
      expect(response.status).toBe(201);
      expect(session).toHaveLength(1);
      expect(session[0]).toMatchObject({ isActive: true });
    });

    it('/vote/start [POST] cannot start 2 voting sessions ', async () => {
      await createVotingSession({
        isActive: true,
        winnerMonsterId: null,
        userVotes: {},
      });
      const response = await request(app.getHttpServer()).post('/vote/start').set(ceoToken).send();

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Voting session already active',
        statusCode: 400,
      });
    });

    it('/vote [POST] should registers a vote ', async () => {
      await createVotingSession({
        isActive: true,
        winnerMonsterId: null,
        userVotes: {},
      });
      const { id } = await dbMonsterModel.create({ name: 'monster1' });

      const response = await request(app.getHttpServer()).post('/vote').set(ceoToken).query({ monsterId: id }).send();
      const session = await dbVoteModel.find({}).exec();
      expect(response.status).toBe(201);
      expect(session).toHaveLength(1);
      expect(session[0]).toMatchObject({ isActive: true, userVotes: { ceo: id } });
    });

    it('/vote [POST] should forbid duplicate votes ', async () => {
      await createVotingSession({
        isActive: true,
        winnerMonsterId: null,
        userVotes: {},
      });
      const { id } = await dbMonsterModel.create({ name: 'monster1' });

      await request(app.getHttpServer()).post('/vote').set(ceoToken).query({ monsterId: id }).send();
      const response = await request(app.getHttpServer()).post('/vote').set(ceoToken).query({ monsterId: id }).send();
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'User already voted',
        statusCode: 400,
      });
    });

    it('/vote/stop [POST] cannot stop unexisting voting sessions', async () => {
      const response = await request(app.getHttpServer()).post('/vote/stop').set(ceoToken).send();

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'No active voting session',
        statusCode: 400,
      });
    });

    it('/vote/stop [POST] should select a winner and stop the voting session', async () => {
      await createVotingSession({
        isActive: true,
        winnerMonsterId: null,
        userVotes: {
          user1: 'monster1',
          user2: 'monster2',
          user3: 'monster2',
        },
      });
      const response = await request(app.getHttpServer()).post('/vote/stop').set(ceoToken).send();

      expect(response.status).toBe(200);
      expect(response.body.winnerMonsterId).toEqual('monster2');
    });

    it('/vote/status [GET] should retrieve the current voting session', async () => {
      await createVotingSession({
        isActive: true,
        winnerMonsterId: null,
        userVotes: {
          user1: 'monster1',
          user2: 'monster2',
        },
      });

      const response = await request(app.getHttpServer()).get('/vote/status').set(ceoToken);
      expect(response.status).toBe(200);
      expect(response.body.userVotes).toMatchObject({
        user1: 'monster1',
        user2: 'monster2',
      });
    });

    async function createVotingSession(vote: Partial<Vote>): Promise<Vote> {
      return await new dbVoteModel(vote).save();
    }
  });
});
