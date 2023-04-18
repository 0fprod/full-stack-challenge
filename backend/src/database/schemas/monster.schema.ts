import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonsterDocument = HydratedDocument<Monster>;

class Name {
  title: string;
  first: string;
  last: string;
}

@Schema()
export class Monster {
  @Prop()
  name: Name;

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

export const MonsterSchema = SchemaFactory.createForClass(Monster);
