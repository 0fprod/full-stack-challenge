import { VoteEntity } from './vote.entity';

describe('VoteEntity', () => {
  let voteEntity: VoteEntity;

  beforeEach(() => {
    voteEntity = new VoteEntity();
  });

  it('should start a vote', () => {
    voteEntity.start();
    expect(voteEntity.isActive).toBe(true);
    expect(voteEntity.voteStart).toBeInstanceOf(Date);
  });

  it('should stop a vote', () => {
    voteEntity.stop();
    expect(voteEntity.isActive).toBe(false);
    expect(voteEntity.voteEnd).toBeInstanceOf(Date);
  });

  it('should vote for a monster', () => {
    voteEntity.vote('John', 'A monster');
    expect(voteEntity.userVotes.get('John')).toBe('A monster');
  });

  it('should not allow a user to vote twice', () => {
    voteEntity.vote('John', 'A monster');
    expect(() => voteEntity.vote('John', 'A different monster')).toThrow('User already voted');
  });

  it('should select a winner', () => {
    voteEntity.userVotes.set('John', 'A monster');
    voteEntity.userVotes.set('Jane', 'A different monster');
    voteEntity.userVotes.set('Bob', 'A monster');
    voteEntity.selectWinner();
    expect(voteEntity.winnerMonsterId).toBe('A monster');
  });
});
