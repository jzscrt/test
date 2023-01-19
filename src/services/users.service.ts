import userModel from '@models/users.model';
import { ApiError } from '@/_utils/apierror.util';
import { BAD_REQUEST, CONFLICT } from 'http-status';
import { CreateUserDto } from '@dtos/users.dto';
import { isEmpty } from 'class-validator';
import { User } from '@interfaces/users.interface';

/**
 * UserService is a class that provides functionality for CRUD operations on User objects.
 *
 * @class UserService
 */
class UserService {
  public users = userModel;

  /**
   * Retrieves all User objects from the database.
   *
   * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
   */
  public async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  /**
   * Retrieves a User object by its id.
   *
   * @param {string} userId - The id of the User object to retrieve.
   * @returns {Promise<User>} - A promise that resolves to the User object.
   */
  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new ApiError(BAD_REQUEST, 'User: invalid userId');

    const user: User[] = await this.users.find({ _id: userId });
    return user[0];
  }

  /**
   * Creates a new User object in the database.
   *
   * @param {CreateUserDto} userData - The data for the new User object.
   * @returns {Promise<User>} - A promise that resolves to the new User object.
   */
  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new ApiError(BAD_REQUEST, 'User: invalid userData');

    const user: User = await this.users.create(userData);
    return user;
  }

  /**
   * Updates a User object by its id.
   *
   * @param {string} userId - The id of the User object to update.
   * @param {CreateUserDto} userData - The updated data for the User object.
   * @returns {Promise<User>} - A promise that resolves to the updated User object.
   */
  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userId)) throw new ApiError(BAD_REQUEST, 'User: invalid userId');
    if (isEmpty(userData)) throw new ApiError(BAD_REQUEST, 'User: invalid userData');

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, userData);
    if (!updateUserById) throw new ApiError(CONFLICT, 'User: user not found');

    const updatedUser: User = await this.findUserById(userId);
    return updatedUser;
  }

  /**
   * Deletes a User object by its id.
   *
   * @param {number} userId - The id of the User object to delete.
   * @returns {Promise<User>} - A promise that resolves to the updated User object.
   */
  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new ApiError(BAD_REQUEST, 'User: invalid userId');

    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new ApiError(CONFLICT, 'User: user not found');

    return deleteUserById;
  }
}

export default UserService;
