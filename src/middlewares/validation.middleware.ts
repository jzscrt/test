import { ApiError } from '@utils/apierror.util';
import { BAD_REQUEST } from 'http-status';
import { plainToInstance } from 'class-transformer';
import { RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';

const reqBody = ['body', 'query', 'files', 'params'] as const;

/**
 * validationMiddleware - express middleware that validates the payload of the request
 * using class-validator library
 *
 * @param {type} type - the class representing the payload
 * @param {value} value - the location of the payload in the request object (body, query, files, or params)
 * @param {skipMissingProperties} skipMissingProperties - whether to skip validation for missing properties
 * @param {whitelist} whitelist - whether to only validate the properties present in the payload
 * @param {forbidNonWhitelisted} forbidNonWhitelisted - whether to forbid properties not present in the payload
 *
 * @returns {RequestHandler} - express middleware function
 */
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
