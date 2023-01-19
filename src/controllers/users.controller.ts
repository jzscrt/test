import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { OK, CREATED } from 'http-status';
import { catchAsync } from '@utils/catchAsync.util';
/* eslint-disable @typescript-eslint/no-unused-vars */

class UserController {
  public userService = new userService();

  public getUsers = catchAsync(async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const findAllUsers: User[] = await this.userService.findAllUsers();

    res.status(OK).json({ data: findAllUsers, message: 'allUsers' });
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
