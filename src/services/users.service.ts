import userModel from '@models/users.model';
import { ApiError } from '@utils/apierror.util';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { CreateUserDto } from '@dtos/users.dto';
import { hash } from 'bcrypt';
import { isEmpty, isNotEmptyObject } from 'class-validator';
import { security } from '@config/config';
import { User } from '@interfaces/users.interface';

class UserService {
  public users = userModel;

  /**
   * Retrieves all User objects from the database.
   *
   * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
   */
  public async findAllUsers(): Promise<User[]> {
    const users = await this.users.find();
    return users.map(user => user.toJSON()) as User[];
  }

  /**
   * Retrieves a User object by its id.
   *
   * @param {string} userId - The id of the User object to retrieve.
   * @returns {Promise<User>} - A promise that resolves to the User object.
   */
  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new ApiError(BAD_REQUEST, 'User: invalid userId');
    const findUser = await this.users.findById(userId);
    if (!findUser) throw new ApiError(NOT_FOUND, 'User: user not found');

    return findUser.toJSON() as User;
  }

  /**
   * Creates a new User object in the database.
   *
   * @param {CreateUserDto} userData - The data for the new User object.
   * @returns {Promise<User>} - A promise that resolves to the new User object.
   */
  public async createUser(userData: CreateUserDto): Promise<User> {
    if (!isNotEmptyObject(userData)) throw new ApiError(BAD_REQUEST, 'USER: invalid userData');

    const findUser = await this.users.findOne({ email: userData.email });
    if (findUser) throw new ApiError(BAD_REQUEST, `USER: email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, security.salt);
    const createUser = await this.users.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.findUserById(createUser.id);
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
    if (!updateUserById) throw new ApiError(NOT_FOUND, 'User: user not found');

    const updatedUser = await this.findUserById(userId);
    return updatedUser[0].toJSON() as User;
  }

  /**
   * Deletes a User object by its id.
   *
   * @param {number} userId - The id of the User object to delete.
   * @returns {Promise<User>} - A promise that resolves to the updated User object.
   */
  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new ApiError(BAD_REQUEST, 'User: invalid userId');

    const deleteUserById = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new ApiError(NOT_FOUND, 'User: user not found');

    return deleteUserById.toJSON() as User;
  }

  /**
   * Finds a user by email
   * @param email - The email of the user
   * @returns A promise that resolves to the user object if found, else it throws an error
   */
  public async findUserByEmail(email: string): Promise<User> {
    if (isEmpty(email)) throw new ApiError(BAD_REQUEST, 'USER: invalid email');

    const findUser = await this.users.findOne({ email });
    if (!findUser) throw new ApiError(BAD_REQUEST, 'USER: does not exists');

    return findUser.toJSON() as User;
  }
}

export default UserService;
