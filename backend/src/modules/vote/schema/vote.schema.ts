import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
class Vote {
  @Prop()
  voteStart: Date;

  @Prop()
  voteEnd: Date;

  @Prop()
  isActive: boolean;

  @Prop()
  winnerMonsterId: string;

  @Prop({ type: Object })
  userVotes: Record<string, string>;
}

export type VoteDocument = HydratedDocument<Vote>;
export const VoteSchema = SchemaFactory.createForClass(Vote);
