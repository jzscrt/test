import dayjs, { Dayjs } from 'dayjs';
import tokenModel from '@models/tokens.model';
import UserService from '@services/users.service';
import { ApiError } from '@utils';
import { BAD_REQUEST } from 'http-status';
import { CreateTokenDto, PackTokenDto } from '@dtos/tokens.dto';
import { isEmpty, isNotEmptyObject } from 'class-validator';
import { jwt } from '@config/config';
import { sign, verify } from 'jsonwebtoken';
import { Token, User } from '@interfaces';
import { TokenType } from '@enums';

class TokenService {
  public userService = new UserService();
  public tokens = tokenModel;

  private _getExpiration(type: TokenType): Dayjs {
    let startDate = dayjs();

    switch (type) {
      case TokenType.REFRESH:
        startDate = startDate.add(jwt.refreshExp, 'days');
        break;
      case TokenType.RESET_PW:
        startDate = startDate.add(jwt.resetPWExp, 'minutes');
        break;
      default:
        startDate = startDate.add(jwt.accessExp, 'minutes');
        break;
    }

    return startDate;
  }

  private _generateToken(userData: User, exp: Dayjs, type: TokenType): string {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid userData');

    const payload: PackTokenDto = {
      sub: userData._id,
      iat: dayjs().unix(),
      exp: exp.unix(),
      type,
    };

    return sign(payload, jwt.secret);
  }

  private async _saveToken(tokenData: CreateTokenDto): Promise<Token> {
    if (!isNotEmptyObject(tokenData)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid tokenData');

    const tokenDoc = await this.tokens.create(tokenData);
    return tokenDoc;
  }

  public async verifyToken(token: string, type: TokenType): Promise<Token> {
    const payload = verify(token, jwt.secret);

    const tokenDoc = await this.tokens.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) new ApiError(BAD_REQUEST, 'TOKEN: not found');

    return tokenDoc;
  }

  public async generateAuthTokens(userData: User): Promise<object> {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid userData');

    const accessTokenExp = this._getExpiration(TokenType.ACCESS);
    const accessToken = this._generateToken(userData, accessTokenExp, TokenType.ACCESS);
    const accessTokenDoc: CreateTokenDto = {
      token: accessToken,
      user: userData._id,
      type: TokenType.ACCESS,
      expires: accessTokenExp.toISOString(),
      blacklisted: false,
    };
    await this._saveToken(accessTokenDoc);

    const refreshTokenExp = this._getExpiration(TokenType.REFRESH);
    const refreshToken = this._generateToken(userData, refreshTokenExp, TokenType.REFRESH);
    const refreshTokenDoc: CreateTokenDto = {
      token: refreshToken,
      user: userData._id,
      type: TokenType.REFRESH,
      expires: refreshTokenExp.toISOString(),
      blacklisted: false,
    };
    await this._saveToken(refreshTokenDoc);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExp,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExp,
      },
    };
  }

  public async generateResetPWToken(email: string): Promise<string> {
    if (isEmpty(email)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid email');

    const findUser: User = await this.userService.findUserByEmail(email);
    if (!findUser) throw new ApiError(BAD_REQUEST, 'TOKEN: user does not exists');

    const resetPWTokenExp = this._getExpiration(TokenType.RESET_PW);
    const resetPWToken = this._generateToken(findUser, resetPWTokenExp, TokenType.RESET_PW);
    const resetPWTokenDoc: CreateTokenDto = {
      token: resetPWToken,
      user: findUser._id,
      type: TokenType.RESET_PW,
      expires: resetPWTokenExp.toISOString(),
      blacklisted: false,
    };
    await this._saveToken(resetPWTokenDoc);

    return resetPWToken;
  }

  public async findToken(tokenStr: string, type: TokenType, blacklisted = false): Promise<Token> {
    if (isEmpty(tokenStr) || isEmpty(type)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid tokenData');

    const tokenDoc = await this.tokens.findOne({ tokenStr, type, blacklisted });
    if (!tokenDoc) throw new ApiError(BAD_REQUEST, 'TOKEN: not found');

    return tokenDoc;
  }

  public async deleteToken(tokenStr: string, type: TokenType, blacklisted = false): Promise<void> {
    if (isEmpty(tokenStr) || isEmpty(type)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid tokenData');

    const tokenDoc = await this.tokens.findOne({ tokenStr, type, blacklisted });
    if (!tokenDoc) throw new ApiError(BAD_REQUEST, 'TOKEN: not found');

    await tokenDoc.remove();
  }

  public async deleteTokensByUser(userData: User, type: TokenType): Promise<void> {
    if (!isNotEmptyObject(userData) || isEmpty(type)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid userData or tokenData');

    await this.tokens.deleteMany({ user: userData._id, type });
  }
}

export default TokenService;
