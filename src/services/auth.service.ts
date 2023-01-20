import { ApiError } from '@utils';
import { BAD_REQUEST } from 'http-status';
import { compare } from 'bcrypt';
import { isNotEmptyObject } from 'class-validator';
import { LoginAuthDto, LogoutAuthDto } from '@dtos/auth.dto';
import { TokenService, UserService } from '@services';
import { TokenType } from '@enums';
import { User } from '@interfaces/users.interface';

class AuthService {
  public userService = new UserService();
  public tokenService = new TokenService();

  public async login(userData: LoginAuthDto): Promise<User> {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'AUTH: invalid userData');

    const findUser: User = await this.userService.findUserByEmail(userData.email);
    if (!findUser) throw new ApiError(BAD_REQUEST, 'AUTH: invalid userId');

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new ApiError(BAD_REQUEST, 'AUTH: password did not match');

    return findUser;
  }

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
