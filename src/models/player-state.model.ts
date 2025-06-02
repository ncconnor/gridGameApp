import { Position } from "./position.model";

export interface PlayerState {
  position: Position;
  health: number;
  moves: number;
}
