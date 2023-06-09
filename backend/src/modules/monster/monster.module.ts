import { Module } from '@nestjs/common';
import { MonsterController } from './monster.controller';
import { MonsterService } from './monster.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MonsterSchema } from './schema/monster.schema';
import { Monster } from './entity/monster.entity';
import { MonsterRepository } from './monster.repository';
import { VoteModule } from '../vote/vote.module';

@Module({
  controllers: [MonsterController],
  providers: [MonsterRepository, MonsterService],
  imports: [MongooseModule.forFeature([{ name: Monster.name, schema: MonsterSchema }]), VoteModule],
  exports: [MonsterService, MonsterRepository],
})
export class MonsterModule {}
