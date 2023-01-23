import { ApiError } from '@utils';
import { AuthService, TokenService, UserService } from '@services';
import { catchAsync } from '@utils';
import { CREATED, FORBIDDEN, OK, UNAUTHORIZED } from 'http-status';
import { CreateUserDto, LoginAuthDto, LogoutAuthDto } from '@dtos';
import { isEmpty } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { TokenType } from '@enums';
import { User } from '@interfaces';
/* eslint-disable @typescript-eslint/no-unused-vars */

class AuthController {
  public authService = new AuthService();
  public tokenService = new TokenService();
  public userService = new UserService();

  public signup = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    const createUserData: User = await this.userService.createUser(userData);

    const tokens = await this.tokenService.generateAuthTokens(createUserData);

    res.status(CREATED).json({ data: { user: createUserData, tokens }, message: 'created' });
  });

  public login = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const loginData: LoginAuthDto = req.body;
    const findUser: User = await this.authService.login(loginData);

    const tokens = await this.tokenService.generateAuthTokens(findUser);

    res.status(OK).json({ data: { user: findUser, tokens }, message: 'logged in' });
  });

  public logout = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const tokens: LogoutAuthDto = {
      accessToken: String(req.body.accessToken),
      refreshToken: String(req.body.refreshToken),
    };

    const authToken = req.headers.authorization;
    if (isEmpty(authToken)) throw new ApiError(UNAUTHORIZED, 'AUTH: invalid token');

    const token = authToken.split('Bearer ')[1];

    const findToken = await this.tokenService.verifyToken(token, TokenType.ACCESS);
    if (findToken.token !== tokens.accessToken) throw new ApiError(FORBIDDEN, 'AUTH: no access rights');

    this.authService.logout(tokens);

    res.status(OK).send({ message: 'logged out' });
  });
}

export default AuthController;
