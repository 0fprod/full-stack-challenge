import { ApiProperty } from '@nestjs/swagger';

export type userName = string;
export type votedFor = string;

export class Vote {
  @ApiProperty({ example: 'id', description: 'vote session id' })
  id: string;
  @ApiProperty({ example: 'voteStart', description: 'vote session start date' })
  voteStart: Date;
  @ApiProperty({ example: new Date(), description: 'vote session end date' })
  voteEnd: Date;
  @ApiProperty({ example: true, description: 'vote session is active' })
  isActive: boolean;
  @ApiProperty({ example: 'winnerMonsterId', description: 'vote session winner monster id' })
  winnerMonsterId: string;
  @ApiProperty({ example: { username: 'monsterId1' }, description: 'vote session user votes' })
  userVotes: Record<userName, votedFor> = {};

  start() {
    this.isActive = true;
    this.voteStart = new Date();
  }

  stop() {
    this.isActive = false;
    this.voteEnd = new Date();
  }

  selectWinner() {
    const monsterVotes: Record<string, number> = {};

    for (const votedFor of Object.values(this.userVotes)) {
      monsterVotes[votedFor] = (monsterVotes[votedFor] ?? 0) + 1;
    }

    let max = 0;
    let winner = '';
    for (const [monsterId, numberOfVotes] of Object.entries(monsterVotes)) {
      if (numberOfVotes > max) {
        max = numberOfVotes;
        winner = monsterId;
      }
    }
    this.winnerMonsterId = winner;
  }

  vote(userName: string, monsterId: string) {
    if (this.userVotes[userName]) {
      throw new Error('User already voted');
    } else {
      this.userVotes[userName] = monsterId;
    }
  }
}
