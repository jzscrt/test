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

  /**
   * Get the expiration date of a token based on its type.
   * @param {TokenType} type - The type of token.
   * @returns {Dayjs} - The expiration date.
   */
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

  /**
   * Generate a token for a user.
   * @param {User} userData - The user to generate token for.
   * @param {Dayjs} exp - The expiration date of the token.
   * @param {TokenType} type - The type of token.
   * @returns {string} - The token.
   */
  private _generateToken(userData: User, exp: Dayjs, type: TokenType): string {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid userData');

    const payload: PackTokenDto = {
      sub: userData.id,
      iat: dayjs().unix(),
      exp: exp.unix(),
      type,
    };

    return sign(payload, jwt.secret);
  }

  /**
   * Save token to the database.
   * @param tokenData - Data for the token
   * @returns - The saved token document
   * @throws - ApiError if tokenData is not a valid object
   */
  private async _saveToken(tokenData: CreateTokenDto): Promise<Token> {
    if (!isNotEmptyObject(tokenData)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid tokenData');

    const tokenDoc = await this.tokens.create(tokenData);
    return tokenDoc;
  }

  /**
   * Verify token is valid and not blacklisted.
   * @param token - The token to verify
   * @param type - The type of token
   * @returns - The token document
   * @throws - ApiError if token is not found or invalid
   */
  public async verifyToken(token: string, type: TokenType): Promise<Token> {
    const payload = verify(token, jwt.secret);

    const tokenDoc = await this.tokens.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });

    return tokenDoc;
  }

  /**
   * Generates the access and refresh tokens for a user.
   * @param {User} userData - The user data that the tokens will be associated with.
   * @returns {object} - An object containing the access token and refresh token.
   * @throws {ApiError} - If the userData is not a valid object.
   */
  public async generateAuthTokens(userData: User): Promise<object> {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid userData');

    const accessTokenExp = this._getExpiration(TokenType.ACCESS);
    const accessToken = this._generateToken(userData, accessTokenExp, TokenType.ACCESS);
    const accessTokenDoc: CreateTokenDto = {
      token: accessToken,
      user: userData.id,
      type: TokenType.ACCESS,
      expires: accessTokenExp.toISOString(),
      blacklisted: false,
    };
    await this._saveToken(accessTokenDoc);

    const refreshTokenExp = this._getExpiration(TokenType.REFRESH);
    const refreshToken = this._generateToken(userData, refreshTokenExp, TokenType.REFRESH);
    const refreshTokenDoc: CreateTokenDto = {
      token: refreshToken,
      user: userData.id,
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

  /**
   * Generates a reset password token for the user with the provided email.
   *
   * @param email Email of the user for whom the reset password token needs to be generated
   * @returns A promise that resolves to the generated reset password token
   * @throws ApiError if the email provided is invalid or the user does not exist
   */
  public async generateResetPWToken(email: string): Promise<string> {
    if (isEmpty(email)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid email');

    const findUser: User = await this.userService.findUserByEmail(email);
    if (!findUser) throw new ApiError(BAD_REQUEST, 'TOKEN: user does not exists');

    const resetPWTokenExp = this._getExpiration(TokenType.RESET_PW);
    const resetPWToken = this._generateToken(findUser, resetPWTokenExp, TokenType.RESET_PW);
    const resetPWTokenDoc: CreateTokenDto = {
      token: resetPWToken,
      user: findUser.id,
      type: TokenType.RESET_PW,
      expires: resetPWTokenExp.toISOString(),
      blacklisted: false,
    };
    await this._saveToken(resetPWTokenDoc);

    return resetPWToken;
  }

  /**
   * Finds a token by token string, type and blacklisted status
   * @param tokenStr - token string
   * @param type - type of token (access, refresh, resetPW)
   * @param blacklisted - whether token is blacklisted or not
   * @returns Token - Token document
   * @throws ApiError - if invalid token data or token not found
   */
  public async findToken(tokenStr: string, type: TokenType, blacklisted = false): Promise<Token> {
    if (isEmpty(tokenStr) || isEmpty(type)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid tokenData');

    const tokenDoc = await this.tokens.findOne({ tokenStr, type, blacklisted });
    if (!tokenDoc) throw new ApiError(BAD_REQUEST, 'TOKEN: not found');

    return tokenDoc;
  }

  /**
   * Deletes a token by token string, type and blacklisted status
   * @param tokenStr - token string
   * @param type - type of token (access, refresh, resetPW)
   * @param blacklisted - whether token is blacklisted or not
   * @throws ApiError - if invalid token data or token not found
   */
  public async deleteToken(tokenStr: string, type: TokenType, blacklisted = false): Promise<void> {
    if (isEmpty(tokenStr) || isEmpty(type)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid tokenData');

    const tokenDoc = await this.tokens.findOne({ tokenStr, type, blacklisted });
    if (!tokenDoc) throw new ApiError(BAD_REQUEST, 'TOKEN: not found');

    await tokenDoc.remove();
  }

  /**
   * Deletes tokens by user id and type
   * @param userData - User document
   * @param type - type of token (access, refresh, resetPW)
   * @throws ApiError - if invalid user data or token data
   */
  public async deleteTokensByUser(userData: User, type: TokenType): Promise<void> {
    if (!isNotEmptyObject(userData) || isEmpty(type)) throw new ApiError(BAD_REQUEST, 'TOKEN: invalid userData or tokenData');

    await this.tokens.deleteMany({ user: userData.id, type });
  }
}

export default TokenService;
