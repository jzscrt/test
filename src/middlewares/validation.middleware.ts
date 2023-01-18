import { ApiError } from '@utils/apierror.util';
import { BAD_REQUEST } from 'http-status';
import { plainToInstance } from 'class-transformer';
import { RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';

const reqBody = ['body', 'query', 'files', 'params'] as const;

const validationMiddleware = (
  type: any,
  value: (typeof reqBody)[number],
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, _res, next) => {
    let payload = req[value];
    if (value === 'files') {
      payload = req.body;
      Object.keys(req[value]).forEach(key => (payload[key] = req[value][key]));
    }
    validate(plainToInstance(type, payload), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        let message = '';
        errors.forEach((error: ValidationError) => {
          if (error.hasOwnProperty('constraints') && error.constraints) {
            message += Object.entries(error.constraints)
              .map(([k, v]) => `@${k} ${v} - ${error.property}`)
              .join(' , ');
          }
          if (error.hasOwnProperty('children') && error.children) {
            message += Object.entries(error.children)
              .map(([k, v]) => `@${k} ${v} - ${error.property}`)
              .join(' , ');
          }
          next(new ApiError(BAD_REQUEST, message));
        });
      } else {
        next();
      }
    });
  };
};

export { validationMiddleware };
