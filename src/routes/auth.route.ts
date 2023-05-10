import AuthController from '@controllers/auth.controller';
import { authenticationMiddleware as auth } from '@middlewares/authentication.middleware';
import { CreateUserDto, LoginAuthDto, LogoutAuthDto } from '@dtos';
import { Route } from '@interfaces/routes.interface';
import { Router } from 'express';
import { validationMiddleware as validate } from '@middlewares/validation.middleware';

class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validate(CreateUserDto, 'body'), this.authController.signup);
    this.router.post(`${this.path}/login`, validate(LoginAuthDto, 'body'), this.authController.login);
    this.router.post(`${this.path}/logout`, auth(['auth$logout']), validate(LogoutAuthDto, 'body'), this.authController.logout);
  }
}

export default AuthRoute;
