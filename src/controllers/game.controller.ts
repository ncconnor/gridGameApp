import { Request, Response } from 'express';
import { GameService } from '../services/game.service';
import { Move, MOVES } from "../models/move.model";
import { sanitizeGameState } from '../utils/sanitize-game-state.util';
import { ErrorResponse } from '../models/error-response.model';
import { GameError } from '../models/error-response.model';

export class GameController {
  constructor(private gameService: GameService) {}

  public startNewGame = async (req: Request, res: Response) => {
    try {
      const gameState = this.gameService.createNewGame();
      res.status(201).json(sanitizeGameState(gameState));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create a new game' });
    }
  }

  public saveGame = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const gameState = this.gameService.loadGame(gameId);
      if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
      }
      this.gameService.saveGame(gameState);
      res.status(200).json({ message: 'Game saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save the game' });
    }
  }

  public loadGame = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const gameState = this.gameService.loadGame(gameId);
      if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.status(200).json(sanitizeGameState(gameState));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load the game' });
    }
  }

  public makeMove = async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const move = req.body.move as Move;

      if (!MOVES.includes(move)) {
        const errorResponse: ErrorResponse = { error: 'Invalid move', code: 'INVALID_MOVE' };
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
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public playerStats = async (req: Request, res: Response) => {
     try {
      const gameId = req.params.id;
      const gameState = this.gameService.loadGame(gameId);
      if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.status(200).json(gameState.player);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load the game' });
    }
  }
}