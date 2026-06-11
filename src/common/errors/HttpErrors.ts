import { AppError } from './AppError.js';

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, 400, true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, 409, true, details);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable Entity', details?: unknown) {
    super(message, 422, true, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500, false);
  }
}
