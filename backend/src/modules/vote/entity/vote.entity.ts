export type userName = string;
export type votedFor = string;

export class Vote {
  id: string;
  voteStart: Date;
  voteEnd: Date;
  isActive: boolean;
  winnerMonsterId: string;
  userVotes: Record<userName, votedFor>;

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
