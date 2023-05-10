/**
 * ApiError is a custom error class for handling HTTP errors.
 * It extends the built-in Error class and adds a few additional properties.
 *
 * @class ApiError
 * @extends {Error}
 */
export class ApiError extends Error {
  public statusCode: number;
  public message: string;
  public isOperational: boolean;
  public stack: any;

  /**
   * Creates an instance of ApiError.
   *
   * @param {number} statusCode - The HTTP status code associated with the error.
   * @param {string} message - The error message.
   * @param {boolean} [isOperational=true] - A boolean flag indicating whether the error is operational (i.e. caused by the application's code)
   *  or not (e.g. a network error).
   * @param {any} [stack=''] - The error stack trace.
   */
  constructor(statusCode: number, message: string, isOperational = true, stack: any = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this);
    }
  }
}
