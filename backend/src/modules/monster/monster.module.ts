import { Module } from '@nestjs/common';
import { MonsterController } from './monster.controller';
import { MonsterService } from './monster.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Monster, MonsterSchema } from '../../database/schemas/monster.schema';

@Module({
  controllers: [MonsterController],
  providers: [MonsterService],
  imports: [MongooseModule.forFeature([{ name: Monster.name, schema: MonsterSchema }])],
})
export class MonsterModule {}
