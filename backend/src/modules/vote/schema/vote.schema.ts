import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { userName, votedFor } from '../entity/vote.entity';

@Schema()
export class Vote {
  @Prop()
  voteStart: Date;

  @Prop()
  voteEnd: Date;

  @Prop()
  isActive: boolean;

  @Prop()
  dragonWinnerId: string;

  @Prop()
  userVotes: Map<userName, votedFor>;
}

export type VoteDocument = HydratedDocument<Vote>;
export const VoteSchema = SchemaFactory.createForClass(Vote);
