import { CELL_TYPES } from "../config/config";
export type CellType = typeof CELL_TYPES[number];

export interface Cell {
  type: CellType;
  visible: boolean;
}
