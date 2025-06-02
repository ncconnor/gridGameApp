export const MOVES = ['up', 'down', 'left', 'right'] as const;
export type Move = typeof MOVES[number];

export const MOVE_UP = 0;
export const MOVE_DOWN = 1;
export const MOVE_LEFT = 2;
export const MOVE_RIGHT = 3;
