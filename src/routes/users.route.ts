import { Router } from 'express';
import { Route } from '@interfaces/routes.interface';
import UserController from '@controllers/users.controller';

class UserRoute implements Route {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:userId`, this.userController.getUsers);
    this.router.get(this.path, this.userController.getUsers);
    this.router.post(this.path, this.userController.createUser);
    this.router.patch(this.path, this.userController.updateUser);
    this.router.delete(`${this.path}/:userId`, this.userController.deleteUser);
  }
}

export default UserRoute;
