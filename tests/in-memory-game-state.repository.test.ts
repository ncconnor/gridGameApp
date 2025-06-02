import { InMemoryGameStateRepository } from '../src/repositories/in-memory-game-state.repository';
import { GameState } from '../src/models/game-state.model';

describe('InMemoryGameStateRepository', () => {
  it('should save and load a game state', () => {
    const repo = new InMemoryGameStateRepository();
    const game: GameState = {
      id: 'test',
      grid: [],
      player: { position: [0,0], health: 1, moves: 1 },
      start: [0,0],
      end: [1,1],
      gameOver: false,
      gameWon: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    repo.save(game);
    expect(repo.load('test')).toEqual(game);
  });

  it('should return undefined for missing game', () => {
    const repo = new InMemoryGameStateRepository();
    expect(repo.load('missing')).toBeUndefined();
  });
});