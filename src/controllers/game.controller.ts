import { Request, Response } from 'express';
import { GameService } from '../services/game.service';
import { Move, MOVES } from "../models/move.model";
import { sanitizeGameState } from '../utils/sanitize-game-state.util';
import { ErrorResponse } from '../models/error-response.model';
import { GameError } from '../models/error-response.model';

const ERROR_GAME_NOT_FOUND = 'Game not found';
const ERROR_INVALID_MOVE = 'Invalid move';
const ERROR_FAILED_CREATE = 'Failed to create a new game';
const ERROR_FAILED_SAVE = 'Failed to save the game';
const ERROR_FAILED_LOAD = 'Failed to load the game';
const ERROR_INTERNAL = 'Internal server error';
const MESSAGE_GAME_SAVED = 'Game saved successfully';

export class GameController {
  constructor(private gameService: GameService) {}

  public startNewGame = async (req: Request, res: Response) => {
    try {
      const gameState = this.gameService.createNewGame();
      res.status(201).json(sanitizeGameState(gameState));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: ERROR_FAILED_CREATE });
    }
  }

  public saveGame = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const gameState = this.gameService.loadGame(gameId);
      if (!gameState) {
        return res.status(404).json({ error: ERROR_GAME_NOT_FOUND });
      }
      this.gameService.saveGame(gameState);
      res.status(200).json({ message: MESSAGE_GAME_SAVED });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: ERROR_FAILED_SAVE });
    }
  }

  public loadGame = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const gameState = this.gameService.loadGame(gameId);
      if (!gameState) {
        return res.status(404).json({ error: ERROR_GAME_NOT_FOUND });
      }
      res.status(200).json(sanitizeGameState(gameState));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: ERROR_FAILED_LOAD });
    }
  }

  public makeMove = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const move = req.body.move as Move;

      if (!MOVES.includes(move)) {
        const errorResponse: ErrorResponse = { error: ERROR_INVALID_MOVE, code: 'INVALID_MOVE' };
        return res.status(400).json(errorResponse);
      }

      const gameState = this.gameService.makeMove(gameId, move);
      res.status(200).json(sanitizeGameState(gameState));
    } catch (error: any) {
      if (error instanceof GameError) {
        if (error.code === 'GAME_OVER' && error.details) {
          return res.status(200).json(sanitizeGameState(error.details));
        }
        return res.status(400).json({ error: error.message, code: error.code });
      }
      res.status(500).json({ error: ERROR_INTERNAL });
    }
  }

  public playerStats = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const gameState = this.gameService.loadGame(gameId);
      if (!gameState) {
        return res.status(404).json({ error: ERROR_GAME_NOT_FOUND });
      }
      res.status(200).json(gameState.player);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: ERROR_FAILED_LOAD });
    }
  }
}