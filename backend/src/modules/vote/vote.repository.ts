import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VoteEntity } from './entity/vote.entity';
import { Model } from 'mongoose';

@Injectable()
export class VoteRepository {
  constructor(@InjectModel(VoteEntity.name) private monsterModel: Model<VoteEntity>) {}

  create(vote: VoteEntity) {
    return this.monsterModel.create(vote);
  }

  find() {
    return this.monsterModel.findOne({ isActive: true }, {}, { lean: true });
  }

  async update(vote: VoteEntity) {
    return this.monsterModel.findOneAndUpdate({ _id: vote.id }, { vote }, { lean: true });
  }
}
