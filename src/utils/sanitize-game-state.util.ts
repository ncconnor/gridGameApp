import { GameState } from "../models/game-state.model";

export function sanitizeGameState(gameState: GameState): any {
  const grid = gameState.grid.map(row =>
    row.map(cell => ({
      type: cell.visible ? cell.type : 'Hidden',
      visible: cell.visible
    }))
  );

  return {
    id: gameState.id,
    player: gameState.player,
    grid,
    start: gameState.start,
    end: gameState.end,
    gameOver: gameState.gameOver,
    gameWon: gameState.gameWon,
    createdAt: gameState.createdAt,
    updatedAt: gameState.updatedAt
  };
}