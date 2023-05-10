import { UserService } from '@services/users.service';
import { catchAsync } from '@utils/catchAsync.util';
import { CREATED, OK } from 'http-status';
import { CreateUserDto } from '@dtos/users.dto';
import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
/* eslint-disable @typescript-eslint/no-unused-vars */

class UserController {
  public userService = new UserService();

  public getUsers = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userId } = req.params;
    const findAllUsers: User[] | User = userId ? await this.userService.findUserById(userId) : await this.userService.findAllUsers();

    res.status(OK).json({ data: findAllUsers, message: userId ? 'getUser' : 'getAllUsers' });
  });

  public createUser = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userData: CreateUserDto = req.body;
    const createUserData: User = await this.userService.createUser(userData);

    res.status(CREATED).json({ data: createUserData, message: 'createdUser' });
  });

  public updateUser = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userId } = req.params;
    const userData: CreateUserDto = req.body;
    const updateUserData: User = await this.userService.updateUser(userId, userData);

    res.status(OK).json({ data: updateUserData, message: 'updatedUser' });
  });

  public deleteUser = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userId } = req.params;
    const deleteUserData: User = await this.userService.deleteUser(userId);

    res.status(OK).json({ data: deleteUserData, message: 'deletedUser' });
  });
}

export default UserController;
