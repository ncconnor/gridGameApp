import { GameState } from "../models/game-state.model";

export interface GameStateRepository {
  save(gameState: GameState): void;
  load(gameId: string): GameState | undefined;
}