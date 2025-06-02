import { sanitizeGameState } from '../src/utils/sanitize-game-state.util';
import { GameState } from '../src/models/game-state.model';

describe('sanitizeGameState', () => {
  it('should hide non-visible cells', () => {
    const game: GameState = {
      id: '1',
      grid: [[{ type: 'Lava', visible: false }]],
      player: { position: [0,0], health: 1, moves: 1 },
      start: [0,0],
      end: [0,0],
      gameOver: false,
      gameWon: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const sanitized = sanitizeGameState(game);
    expect(sanitized.grid[0][0].type).toBe('Hidden');
  });

  it('should show type for visible cells', () => {
    const game: GameState = {
      id: '1',
      grid: [[{ type: 'Lava', visible: true }]],
      player: { position: [0,0], health: 1, moves: 1 },
      start: [0,0],
      end: [0,0],
      gameOver: false,
      gameWon: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const sanitized = sanitizeGameState(game);
    expect(sanitized.grid[0][0].type).toBe('Lava');
  });
});