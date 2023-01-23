import UserService from '@services/users.service';
import { ApiError } from '@utils';
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallback } from 'passport-jwt';
import { jwt } from '@config/config';
import { TokenType } from '@enums';
import { UNAUTHORIZED } from 'http-status';
import { User } from '@interfaces/users.interface';

const options: StrategyOptions = {
  secretOrKey: jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verify: VerifyCallback = async (payload, cb) => {
  const userService = new UserService();
  try {
    if (payload.type !== TokenType.ACCESS) {
      throw new ApiError(UNAUTHORIZED, 'PASSPORT: invalid token');
    }
    const findUser: User = await userService.findUserById(payload.sub);
    if (!findUser) {
      return cb(null, null, 'PASSPORT: user not found');
    }
    return cb(null, findUser, null);
  } catch (error) {
    const err = error as ApiError;
    cb(err, false, `PASSPORT: ${err.message}`);
  }
};

const jwtStrategy = new Strategy(options, verify);

export { jwtStrategy };
