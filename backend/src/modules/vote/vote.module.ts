import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote } from './entity/vote.entity';
import { VoteSchema } from './schema/vote.schema';
import { MonsterModule } from '../monster/monster.module';

@Module({
  controllers: [VoteController],
  providers: [VoteService, VoteRepository],
  imports: [MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]), MonsterModule],
})
export class VoteModule {}
