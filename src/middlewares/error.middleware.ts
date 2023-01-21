import httpStatus from 'http-status';
import { ApiError } from '@utils/apierror.util';
import { env } from '@config/config';
import { Error } from 'mongoose';
import { logger } from '@utils/logger.util';
import { NextFunction, Request, Response } from 'express';

/**
 * errorConverter - function that converts the error received in the middleware
 * to an ApiError with appropriate statusCode and message
 *
 * @param {any} error - error object received
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @param {NextFunction} next - express next function
 */
const errorConverter = (error: any, _req: Request, _res: Response, next: NextFunction) => {
  if (!(error instanceof ApiError)) {
    const { err } = error;
    const statusCode = err.statusCode || error instanceof Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, error.stack);
  }
  next(error);
};

/**
 * errorHandler - function that handles the error received in the middleware
 * and sends a json response to the client with appropriate statusCode and message
 *
 * @param {any} error - error object received
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @param {NextFunction} next - express next function
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: any, req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = error;
  if (env === 'production' && !error.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = error.message;

  const response = {
    code: statusCode,
    message,
    ...(env === 'development' && { stack: error.stack }),
  };

  if (env === 'development') {
    const stack = response.stack.split('\n');
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${message}${'\n'}${stack
        .splice(1 - stack.length, stack.length)
        .join('\n')}`,
    );
  }

  res.status(statusCode).json({ response });
};

export { errorConverter, errorHandler };
