import { Cell } from "./cell.model";
import { PlayerState } from "./player-state.model";
import { Position } from "./position.model";

export interface GameState {
  id: string;
  player: PlayerState;
  grid: Cell[][];
  start: Position;
  end: Position;
  gameOver: boolean;
  gameWon: boolean;
  createdAt: Date;
  updatedAt: Date;
}


