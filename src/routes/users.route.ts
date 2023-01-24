import UserController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos';
import { Route } from '@interfaces/routes.interface';
import { Router } from 'express';
import { validationMiddleware as validate } from '@middlewares/validation.middleware';
import { authenticationMiddleware as auth } from '@middlewares/authentication.middleware';

class UserRoute implements Route {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:userId`, auth(['user-o']), this.userController.getUsers);
    this.router.get(this.path, auth(['user-r']), this.userController.getUsers);
    this.router.post(this.path, auth(['user-w']), validate(CreateUserDto, 'body'), this.userController.createUser);
    this.router.patch(this.path, auth(['user-w']), this.userController.updateUser);
    this.router.delete(`${this.path}/:userId`, auth(['user-x']), this.userController.deleteUser);
  }
}

export default UserRoute;
