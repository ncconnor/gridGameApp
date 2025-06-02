import request from 'supertest';
import app from '../src/app';
import { GameService } from '../src/services/game.service';
import { GameState } from '../src/models/game-state.model';
import { Move, MOVE_DOWN, MOVES } from '../src/models/move.model';
import { PlayerState } from '../src/models/player-state.model';
import { Position } from '../src/models/position.model';
import { Cell } from '../src/models/cell.model';

describe('Game API', () => {
  let gameService: GameService;
  let gameId: string;
  

  beforeAll(() => {
    gameService = new GameService();
  });

  test('POST /api/games - create a new game', async () => {
    const response = await request(app).post('/api/games');
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    gameId = response.body.id;
    expect(response.body.player.health).toBe(200);
    expect(response.body.player.moves).toBe(450);
    expect(response.body.gameOver).toBe(false);
  });

  test('GET /api/games/:id - load the created game', async () => {
    const response = await request(app).get(`/api/games/${gameId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(gameId);
  });

  test('POST /api/games/:id/move - make a valid move', async () => {
    const createResponse = await request(app).post('/api/games');
    const initialPos = createResponse.body.player.position.slice();
    const newGameId = createResponse.body.id; // Get the gameId from the response
    const moveResponse = await request(app)
      .post(`/api/games/${newGameId}/move`)
      .send({ move: MOVES[MOVE_DOWN] });

    expect(moveResponse.body.player.position[0]).toBe(initialPos[0] + 1);
    expect(moveResponse.status).toBe(200);
    expect(moveResponse.body.player.health).toBeLessThanOrEqual(200);
    expect(moveResponse.body.player.moves).toBeLessThanOrEqual(450);
  });

  test('POST /api/games/:id/move - invalid move', async () => {
    const response = await request(app)
      .post(`/api/games/${gameId}/move`)
      .send({ move: 'invalid' });
    expect(response.status).toBe(400);
  });

  test('Play through an entire game until win or game over', async () => {
    // Start a new game
    const createResponse = await request(app).post('/api/games');
    expect(createResponse.status).toBe(201);
    const gameId = createResponse.body.id;

    let gameOver = false;
    let moveCount = 0;
    let lastState = createResponse.body;

    // Try to move down until the game ends (win or lose)
    while (!gameOver && moveCount < 100) {
      const moveResponse = await request(app)
        .post(`/api/games/${gameId}/move`)
        .send({ move: 'down' });
      expect([200, 400]).toContain(moveResponse.status);

      lastState = moveResponse.body;
      gameOver = lastState.gameOver;
      moveCount++;
    }

    expect(gameOver).toBe(true);
    expect(lastState.player.health).toBeLessThanOrEqual(200);
    expect(lastState.player.moves).toBeLessThanOrEqual(450);
    // Optionally check if the game was won or lost
    expect(typeof lastState.gameWon).toBe('boolean');
  });

  test('Player position updates correctly on valid move', async () => {
    const createResponse = await request(app).post('/api/games');
    const initialPos = createResponse.body.player.position.slice();
    const moveResponse = await request(app)
      .post(`/api/games/${gameId}/move`)
      .send({ move: MOVES[MOVE_DOWN] });
    expect(moveResponse.body.player.position[0]).toBe(initialPos[0] + 1);
  });
});

test('Run two games at the same time and ensure state is independent', async () => {
  // Start two new games
  const createResponse1 = await request(app).post('/api/games');
  const createResponse2 = await request(app).post('/api/games');
  expect(createResponse1.status).toBe(201);
  expect(createResponse2.status).toBe(201);

  const gameId1 = createResponse1.body.id;
  const gameId2 = createResponse2.body.id;
  const initialPos1 = createResponse1.body.player.position.slice();
  const initialPos2 = createResponse2.body.player.position.slice();

  // Make a move in each game
  const moveResponse1 = await request(app)
    .post(`/api/games/${gameId1}/move`)
    .send({ move: MOVES[MOVE_DOWN] });

  const moveResponse2 = await request(app)
    .post(`/api/games/${gameId2}/move`)
    .send({ move: MOVES[MOVE_DOWN] });

  // Check that each game's state updated independently
  expect(moveResponse1.body.player.position[0]).toBe(initialPos1[0] + 1);
  expect(moveResponse2.body.player.position[0]).toBe(initialPos2[0] + 1);
  expect(moveResponse1.body.id).toBe(gameId1);
  expect(moveResponse2.body.id).toBe(gameId2);
  expect(moveResponse1.body.id).not.toBe(moveResponse2.body.id);
});