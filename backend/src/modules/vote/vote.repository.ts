import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vote } from './entity/vote.entity';
import { Model } from 'mongoose';
import { VoteDocument } from './schema/vote.schema';

@Injectable()
export class VoteRepository {
  constructor(@InjectModel(Vote.name) private monsterModel: Model<Vote>) {}

  async create(vote: Vote) {
    return this.mapDocumentToEntity(await this.monsterModel.create(vote));
  }

  async find() {
    const doc = await this.monsterModel.findOne({ isActive: true }, {}, { lean: true });
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async update(vote: Vote) {
    const doc = await this.monsterModel.findOneAndUpdate({ _id: vote.id }, vote, { lean: true, new: true });

    return this.mapDocumentToEntity(doc);
  }

  private mapDocumentToEntity(vote: VoteDocument): Vote {
    const newVote = new Vote();
    newVote.id = vote._id.toString();
    newVote.isActive = vote.isActive;
    newVote.winnerMonsterId = vote.winnerMonsterId;
    newVote.userVotes = vote.userVotes ?? {};
    newVote.voteEnd = vote.voteEnd;
    newVote.voteStart = vote.voteStart;
    return newVote;
  }
}
