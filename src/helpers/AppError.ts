//  Custom AppError class
// Throw this anywhere in your app for controlled HTTP errors:
// throw new AppError("User not found", status.NOT_FOUND)
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
