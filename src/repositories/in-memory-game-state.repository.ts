import { GameState } from "../models/game-state.model";
import { GameStateRepository } from "./game-state.repository";

export class InMemoryGameStateRepository implements GameStateRepository {
  private games = new Map<string, GameState>();

  save(gameState: GameState): void {
    this.games.set(gameState.id, gameState);
  }

  load(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }
}