import { GameController } from '../src/controllers/game.controller';
import { GameService } from '../src/services/game.service';
import { GameError } from '../src/models/error-response.model';
import { Request, Response } from 'express';

describe('GameController with mocked GameService', () => {
  let controller: GameController;
  let mockGameService: jest.Mocked<GameService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockGameService = {
      makeMove: jest.fn(),
      // Add other methods if needed
    } as any;

    controller = new GameController(mockGameService);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 200 and gameOver when health <= 0', async () => {
    const fakeGameState = {
      id: 'test-id',
      player: { position: [1, 1], health: -10, move: 10 },
      grid: [],
      start: [0, 0],
      end: [2, 2],
      gameOver: true,
      gameWon: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGameService.makeMove.mockImplementation(() => {
      throw new GameError('Game is already completed', 'GAME_OVER', fakeGameState);
    });

    req = { params: { id: 'test-id' }, body: { move: 'down' } };

    // @ts-ignore
    await controller.makeMove(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      gameOver: true,
      player: expect.objectContaining({ health: -10 }),
    }));
  });

  it('should return 200 and gameWon when reaching endpoint', async () => {
    const fakeGameState = {
      id: 'test-id',
      player: { position: [2, 2], health: 100, move: 10 },
      grid: [],
      start: [0, 0],
      end: [2, 2],
      gameOver: true,
      gameWon: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGameService.makeMove.mockImplementation(() => {
      throw new GameError('Game is already completed', 'GAME_OVER', fakeGameState);
    });

    req = { params: { id: 'test-id' }, body: { move: 'down' } };

    // @ts-ignore
    await controller.makeMove(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      gameOver: true,
      gameWon: true,
      player: expect.objectContaining({ position: [2, 2] }),
    }));
  });

  it('should return 400 and error message for out of bounds move', async () => {
    // Simulate GameService throwing an out-of-bounds error
    mockGameService.makeMove.mockImplementation(() => {
      throw new GameError('Invalid move', 'INVALID_MOVE');
    });

    req = { params: { id: 'test-id' }, body: { move: 'up' } };

    // @ts-ignore
    await controller.makeMove(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Invalid move',
      code: 'INVALID_MOVE',
    }));
  });
});