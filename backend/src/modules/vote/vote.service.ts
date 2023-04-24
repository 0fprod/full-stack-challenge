import { Injectable } from '@nestjs/common';
import { MonsterRepository } from '../monster/monster.repository';
import { VoteEntity } from './entity/vote.entity';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
  constructor(private voteRepository: VoteRepository, private monsterRepository: MonsterRepository) {}

  startVotingSession() {
    const votingSession = new VoteEntity();
    votingSession.start();
    this.voteRepository.create(votingSession);
  }

  async stopVotingSession() {
    const activeVotingSession = await this.voteRepository.find();
    activeVotingSession.stop();
    activeVotingSession.selectWinner();
    this.voteRepository.update(activeVotingSession);
  }

  async vote(userName: string, monsterId: string) {
    const activeVotingSession = await this.voteRepository.find();
    activeVotingSession.vote(userName, monsterId);
    this.voteRepository.update(activeVotingSession);
  }
}
