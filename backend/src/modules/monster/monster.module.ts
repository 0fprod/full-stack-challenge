import { Module } from '@nestjs/common';
import { MonsterController } from './monster.controller';
import { MonsterService } from './monster.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MonsterSchema } from './schema/monster.schema';
import { MonsterEntity } from './entity/monster.entity';

@Module({
  controllers: [MonsterController],
  providers: [MonsterService],
  imports: [MongooseModule.forFeature([{ name: MonsterEntity.name, schema: MonsterSchema }])],
})
export class MonsterModule {}
