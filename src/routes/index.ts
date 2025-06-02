import { Router } from 'express';
import { GameController } from '../controllers/game.controller';
import { GameService } from '../services/game.service';

export default function createRouter(gameService: GameService) {
  const router = Router();
  const gameController = new GameController(gameService);

  router.post('/games', gameController.startNewGame);
  router.post('/games/:id/save', gameController.saveGame);
  router.get('/games/:id', gameController.loadGame);
  router.post('/games/:id/move', gameController.makeMove);
  router.get('/games/:id/player', gameController.playerStats);

  return router;
}