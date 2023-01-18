import httpStatus from 'http-status';
import { ApiError } from '@utils/apierror.util';
import { env } from '@config/config';
import { Error } from 'mongoose';
import { logger } from '@utils/logger.util';
import { NextFunction, Request, Response } from 'express';

const errorConverter = (error: any, req: Request, res: Response, next: NextFunction) => {
  const err = error;
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || err instanceof Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, error.stack);
  }
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
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
