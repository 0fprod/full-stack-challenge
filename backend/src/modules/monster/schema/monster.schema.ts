import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MonsterName } from '../entity/monster.entity';

@Schema()
class Monster {
  @Prop()
  name: MonsterName;

  @Prop()
  gender: string;

  @Prop()
  description: string;

  @Prop()
  nationality: string[];

  @Prop()
  imageUrl: string;

  @Prop()
  goldBalance: number;

  @Prop()
  speed: number;

  @Prop()
  health: number;

  @Prop()
  secretNotes: string;

  @Prop()
  monsterPassword: string;
}

export type MonsterDocument = HydratedDocument<Monster>;
export const MonsterSchema = SchemaFactory.createForClass(Monster);
