import { GameState } from "../models/game-state.model";
import { Move } from "../models/move.model";
import { Position } from "../models/position.model";
import { PlayerState } from "../models/player-state.model";
import { Cell, CellType } from "../models/cell.model";
import config from "../config/config";
import { v4 as uuidv4 } from 'uuid';
import { GameError } from "../models/error-response.model";
import { GameStateRepository } from "../repositories/game-state.repository";
import { InMemoryGameStateRepository } from "../repositories/in-memory-game-state.repository";


const ERROR_GAME_NOT_FOUND = 'Game not found';
const ERROR_GAME_OVER = 'Game is already completed';
const ERROR_INVALID_MOVE = 'Invalid move';

export class GameService {
  private repository: GameStateRepository;

  constructor(repository: GameStateRepository = new InMemoryGameStateRepository()) {
    this.repository = repository;
  }

  createNewGame(gridSize: number = config.GRID_SIZE): GameState {
    const grid = this.generategrid(gridSize);
    const start: Position = [0, Math.floor(Math.random() * gridSize)];
    const end: Position = [gridSize - 1, Math.floor(Math.random() * gridSize)];

    const player: PlayerState = {
      position: start,
      health: config.INITIAL_HEALTH,
      moves: config.INITIAL_MOVE
    };

    const gameState: GameState = {
      id: uuidv4(),
      player,
      grid,
      start,
      end,
      gameOver: false,
      gameWon: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.makeCellVisible(gameState, start[0], start[1]);
    this.repository.save(gameState);
    return gameState;
  }

  saveGame(gameState: GameState): void {
    gameState.updatedAt = new Date();
    this.repository.save(gameState);
  }

  loadGame(gameId: string): GameState | undefined {
    return this.repository.load(gameId);
  }

  makeMove(gameId: string, move: Move): GameState {
    const gameState = this.loadGame(gameId);
    if (!gameState) {
      throw new GameError(ERROR_GAME_NOT_FOUND, 'GAME_NOT_FOUND');
    }
    if (gameState.gameOver) {
      throw new GameError(ERROR_GAME_OVER, 'GAME_OVER', gameState);
    }

    const [row, col] = gameState.player.position;
    let newRow = row;
    let newCol = col;

    switch (move) {
      case 'up': newRow--; break;
      case 'down': newRow++; break;
      case 'left': newCol--; break;
      case 'right': newCol++; break;
    }

    if (!this.isValidPosition(gameState, [newRow, newCol])) {
      throw new GameError(ERROR_INVALID_MOVE, 'INVALID_MOVE');
    }

    const cell = gameState.grid[newRow][newCol];
    const effect = config.CELL_TYPE_EFFECTS[cell.type];
    const newHealth = gameState.player.health + effect.health;
    const newMove = gameState.player.moves + effect.move;

    if (newHealth <= 0 || newMove <= 0) {
      gameState.player.health = newHealth;
      gameState.player.moves = newMove;
      gameState.gameOver = true;
    } else {
      gameState.player.position = [newRow, newCol];
      gameState.player.health = newHealth;
      gameState.player.moves = newMove;

      this.makeCellVisible(gameState, newRow, newCol);

      if (newRow === gameState.end[0] && newCol === gameState.end[1]) {
        gameState.gameWon = true;
        gameState.gameOver = true;
      }
    }

    this.saveGame(gameState);
    return gameState;
  }

  private generategrid(size: number): Cell[][] {
    const grid: Cell[][] = [];
    for (let i = 0; i < size; i++) {
      grid[i] = [];
      for (let j = 0; j < size; j++) {
        const rand = Math.random();
        let terrain: CellType = 'Blank';
        let weightSum = 0;
        
        for (let k = 0; k < config.CELL_TYPE_WEIGHTS.length; k++) {
          weightSum += config.CELL_TYPE_WEIGHTS[k];
          if (rand <= weightSum) {
            terrain = config.CELL_TYPES[k];
            break;
          }
        }
        
        grid[i][j] = { type: terrain, visible: false };
      }
    }
    return grid;
  }

  // this method makes surrounding cells visible
  private makeCellVisible(gameState: GameState, row: number, col: number): void {
    gameState.grid[row][col].visible = true;

    // up, down, left, right
    const moves: [number, number][] = [[-1,0], [1,0], [0,-1], [0,1]];

    for (const [dr, dc] of moves) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (this.isValidPosition(gameState, [newRow, newCol])) {
        gameState.grid[newRow][newCol].visible = true;
      }
    }
  }

  private isValidPosition(gameState: GameState, [row, col]: Position): boolean {
    return row >= 0 && row < gameState.grid.length && 
           col >= 0 && col < gameState.grid[0].length;
  }
}