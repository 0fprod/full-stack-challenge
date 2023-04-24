export type userName = string;
export type votedFor = string;

export class VoteEntity {
  id: string;
  voteStart: Date;
  voteEnd: Date;
  isActive: boolean;
  winnerMonsterId: string;
  userVotes: Map<userName, votedFor>;

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

    for (const votedFor of this.userVotes.values()) {
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
    if (!this.userVotes.has(userName)) {
      this.userVotes.set(userName, monsterId);
    } else {
      throw new Error('User already voted');
    }
  }
}
