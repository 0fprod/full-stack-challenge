import { Injectable } from '@nestjs/common';
import { Vote } from './entity/vote.entity';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
  constructor(private voteRepository: VoteRepository) {}

  async startVotingSession() {
    const activeVotingSession = await this.voteRepository.find();
    if (activeVotingSession) {
      throw new Error('Voting session already active');
    }

    const votingSession = new Vote();
    votingSession.start();
    await this.voteRepository.create(votingSession);
  }

  async stopVotingSession() {
    const activeVotingSession = await this.voteRepository.find();
    if (!activeVotingSession) {
      throw new Error('No active voting session');
    }
    activeVotingSession.stop();
    activeVotingSession.selectWinner();
    const updatedVotingSession = await this.voteRepository.update(activeVotingSession);
    return updatedVotingSession;
  }

  async vote(user: any, monsterId: string) {
    const userName = user['username'];
    const activeVotingSession = await this.voteRepository.find();
    if (!activeVotingSession) {
      throw new Error('No active voting session');
    }
    activeVotingSession.vote(userName, monsterId);
    await this.voteRepository.update(activeVotingSession);
  }

  async viewVotes() {
    const activeVotingSession = await this.voteRepository.find();
    return activeVotingSession;
  }
}
