import { NextFunction, Request, Response } from 'express';
import { ApiError } from './apierror.util';

/**
 * catchAsync is a utility function for handling asynchronous errors in Express.js route handlers.
 * It wraps a route handler function in a try-catch block and passes any errors to the next middleware.
 *
 * @param {any} fn - The route handler function to be wrapped.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - The wrapped function.
 */
export const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  const errFcn = (error: any) => {
    const err = error as ApiError;
    next({ err, message: error.message });
  };
  try {
    Promise.resolve(fn(req, res, next)).catch(error => {
      errFcn(error);
    });
  } catch (error) {
    errFcn(error);
  }
};
