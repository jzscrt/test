import passport from 'passport';
import TokenService from '@services/tokens.service';
import { ApiError, checkRights, mapRoles, mergeRoleRights } from '@utils';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status';
import { isEmpty } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { roleRights } from '@config/roles';
import { TokenType } from '@enums';
import { User } from '@interfaces/users.interface';

const tokenSerivce = new TokenService();

const verify = (permissions: string[], req: Request, res: Response, resolve: any, reject: any) => async (err: any, user: User, info: any) => {
  try {
    if (err || !user || info) {
      return reject(new ApiError(UNAUTHORIZED, `AUTH: authentication failed; ${err || info}`));
    }

    const authToken = req.headers.authorization;
    if (isEmpty(authToken)) return reject(new ApiError(UNAUTHORIZED, 'AUTH: invalid token'));

    const token = authToken.split('Bearer ')[1];
    const findToken = await tokenSerivce.verifyToken(token, TokenType.ACCESS);
    if (!findToken) return reject(new ApiError(FORBIDDEN, 'AUTH: expired or invalid token'));

    if (permissions.length) {
      const userRights = mergeRoleRights(user.role.map(role => mapRoles(roleRights.get(role))).flat());
      const allowedRights = mergeRoleRights(mapRoles(permissions));
      const hasRequiredRights = checkRights(userRights, allowedRights);
      if (!hasRequiredRights) return reject(new ApiError(FORBIDDEN, 'AUTH: no access rights'));

      if (Object.keys(allowedRights).indexOf('user') > -1) {
        if (allowedRights['user'].includes('o')) {
          const { userId } = req.params;
          if (user.id !== userId) return reject(new ApiError(FORBIDDEN, 'AUTH: no access rights'));
        }
      }
    }

    res.locals.user = user;

    return resolve();
  } catch (error) {
    const err = error as ApiError;
    return reject({ err, message: error.message });
  }
};

const authenticationMiddleware = (permissions: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verify(permissions, req, res, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};

export { authenticationMiddleware };
