export const CELL_TYPES = ['Blank', 'Speeder', 'Lava', 'Mud'] as const;

export default {
  PORT: process.env.PORT || 3000,
  GRID_SIZE: 50,
  INITIAL_HEALTH: 200,
  INITIAL_MOVE: 450,
  CELL_TYPES,
  CELL_TYPE_WEIGHTS: [0.7, 0.1, 0.1, 0.1],
  CELL_TYPE_EFFECTS: {
    Blank: { health: 0, move: -1 },
    Speeder: { health: -5, move: 0 },
    Lava: { health: -50, move: -10 },
    Mud: { health: -10, move: -5 },
  },
};