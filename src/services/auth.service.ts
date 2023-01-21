import userModel from '@models/users.model';
import { ApiError } from '@utils';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { compare } from 'bcrypt';
import { isNotEmptyObject } from 'class-validator';
import { LoginAuthDto, LogoutAuthDto } from '@dtos/auth.dto';
import { TokenService, UserService } from '@services';
import { TokenType } from '@enums';
import { User } from '@interfaces/users.interface';

class AuthService {
  private user = userModel;
  public userService = new UserService();
  public tokenService = new TokenService();

  /**
   * login - logs a user in
   *
   * @param {LoginAuthDto} userData - user email and password
   * @returns {Promise<User>} - user object
   */
  public async login(userData: LoginAuthDto): Promise<User> {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'AUTH: invalid userData');

    const findUser = await this.user.find({ email: userData.email });
    if (!findUser.length) throw new ApiError(NOT_FOUND, 'AUTH: user not found');

    const isPasswordMatching: boolean = await compare(userData.password, findUser[0].password);
    if (!isPasswordMatching) throw new ApiError(BAD_REQUEST, 'AUTH: password did not match');

    return findUser[0].toJSON() as User;
  }

  /**
   * logout - logs a user out
   *
   * @param {LogoutAuthDto} tokens - access token and refresh token
   */
  public async logout(tokens: LogoutAuthDto) {
    if (!isNotEmptyObject(tokens)) throw new ApiError(BAD_REQUEST, 'AUTH: invalid tokens');

    const refreshTokenDoc = await this.tokenService.findToken(tokens.refreshToken, TokenType.REFRESH);
    if (!refreshTokenDoc) throw new ApiError(BAD_REQUEST, 'AUTH: token not found');

    const accessTokenDoc = await this.tokenService.findToken(tokens.accessToken, TokenType.ACCESS);
    if (!accessTokenDoc) throw new ApiError(BAD_REQUEST, 'AUTH: token not found');

    await this.tokenService.deleteToken(tokens.accessToken, TokenType.ACCESS);
    await this.tokenService.deleteToken(tokens.refreshToken, TokenType.REFRESH);
  }
}

export default AuthService;
