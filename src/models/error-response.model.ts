export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

export const GAME_ERROR_NAME = "GameError";

export class GameError extends Error implements ErrorResponse {
  code?: string;
  details?: any;

  constructor(error: string, code?: string, details?: any) {
    super(error);
    this.name = GAME_ERROR_NAME;
    this.code = code;
    this.details = details;
  }

  get error(): string {
    return this.message;
  }
}