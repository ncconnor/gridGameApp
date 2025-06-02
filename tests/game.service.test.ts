import { GameService } from '../src/services/game.service';
import { InMemoryGameStateRepository } from '../src/repositories/in-memory-game-state.repository';
import { Move, MOVES } from '../src/models/move.model';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    service = new GameService(new InMemoryGameStateRepository());
  });

  it('should create a new game with correct initial state', () => {
    const game = service.createNewGame(5);
    expect(game.id).toBeDefined();
    expect(game.player.health).toBeGreaterThan(0);
    expect(game.gameOver).toBe(false);
  });

  it('should save and load a game', () => {
    const game = service.createNewGame(5);
    service.saveGame(game);
    const loaded = service.loadGame(game.id);
    expect(loaded).toBeDefined();
    expect(loaded?.id).toBe(game.id);
  });

  it('should throw GAME_NOT_FOUND for missing game', () => {
    expect(() => service.makeMove('missing-id', 'up')).toThrow(/Game not found/);
  });

  it('should throw GAME_OVER if game is already over', () => {
    const game = service.createNewGame(5);
    game.gameOver = true;
    service.saveGame(game);
    expect(() => service.makeMove(game.id, 'up')).toThrow(/Game is already completed/);
  });

  it('should throw for out-of-bounds move', () => {
    const game = service.createNewGame(5);
    game.player.position = [0, 0];
    service.saveGame(game);
    expect(() => service.makeMove(game.id, 'up')).toThrow(/Invalid move/);
  });

  it('should update player position and stats on valid move', () => {
    const game = service.createNewGame(5);
    const oldPos = [...game.player.position];
    service.saveGame(game);
    const updated = service.makeMove(game.id, 'down');
    expect(updated.player.position[0]).toBe(oldPos[0] + 1);
    expect(updated.player.health).toBeLessThanOrEqual(game.player.health);
    expect(updated.player.moves).toBeLessThanOrEqual(game.player.moves);
  });

});