import { Module } from '@nestjs/common';
import { MonsterController } from './monster.controller';
import { MonsterService } from './monster.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MonsterSchema } from './schema/monster.schema';
import { MonsterEntity } from './entity/monster.entity';
import { MonsterRepository } from './monster.repository';

@Module({
  controllers: [MonsterController],
  providers: [MonsterRepository, MonsterService],
  imports: [MongooseModule.forFeature([{ name: MonsterEntity.name, schema: MonsterSchema }])],
})
export class MonsterModule {}
