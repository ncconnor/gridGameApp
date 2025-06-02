export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

export class GameError extends Error implements ErrorResponse {
  code?: string;
  details?: any;

  constructor(error: string, code?: string, details?: any) {
    super(error);
    this.name = "GameError";
    this.code = code;
    this.details = details;
  }

  get error(): string {
    return this.message;
  }
}