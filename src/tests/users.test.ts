import mongoose from 'mongoose';
import request from 'supertest';
import userModel from '../models/user.model';
import { User } from '../interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { createUserDto } from './user.factory';
import { setupAppAndUserRoute } from './utlis/testUtils';
import { Application } from 'express';

let appInstance: Application;
let userRoutePath: string;

beforeAll(() => {
  const { app, userRoute } = setupAppAndUserRoute();
  appInstance = app.app;
  userRoutePath = `/v1/${userRoute.path}`;
});

afterAll(async () => {
  // Delete the test users created during the tests
  await userModel.deleteOne({ email: 'newaccount@regalcredit.com' });
  await userModel.deleteOne({ email: 'existinguser@test.com' });
  await userModel.deleteMany({ email: /user\d+@test\.com/ });

  // Close the Mongoose connection
  await mongoose.disconnect();
});

describe('Testing Users...', () => {
  describe('[GET] /v1/users - Get all users', () => {
    it('response statusCode 200 / allUsers Success', async () => {
      const users = userModel;
      const allUsers: User[] = await users.find();

      return request(appInstance).get(userRoutePath).expect(201, { data: allUsers, message: 'allUsers' });
    });
  });

  describe('[POST] /v1/users - Create a user', () => {
    it('response statusCode 201 / createdUser Success', async () => {
      const existingUser = await userModel.findOne();
      if (!existingUser) throw new Error('No existing user found in the database');

      const payloadBody: CreateUserDto = createUserDto();

      return request(appInstance)
        .post(`${userRoutePath}`)
        .send(payloadBody)
        .expect(201, {
          data: expect.objectContaining(payloadBody),
          message: 'createdUser',
        });
    });

    it('response statusCode 400 / createdUser Fail - Duplicate email', async () => {
      const existingUser = await userModel.findOne();
      if (!existingUser) {
        throw new Error('No existing user found in the database');
      }

      const payloadBody: CreateUserDto = {
        ...createUserDto(),
        email: existingUser.email,
      };

      return request(appInstance)
        .post(`${userRoutePath}`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 400,
            message: `USER: email ${payloadBody.email} already exists`,
          },
        });
    });

    it('response statusCode 400 / createdUser Fail - Empty request', async () => {
      const payloadBody: CreateUserDto = {
        name: '',
        email: 'newaccount@regalcredit.com',
        password: 'password',
        status: '123456',
        role: ['user'],
      };

      return request(appInstance)
        .post(`${userRoutePath}`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 500,
            message: 'User validation failed: name: Path `name` is required.',
          },
        });
    });
  });

  describe('[PATCH] /v1/users - Update a users', () => {
    it('response statusCode 201 / updatedUser Success', async () => {
      const existingUser = await userModel.findOne();
      if (!existingUser) throw new Error('No existing user found in the database');
      const payloadBody: UpdateUserDto = {
        name: 'test',
        status: 'deleted',
        role: ['user'],
      };

      return request(appInstance)
        .patch(`${userRoutePath}/${existingUser._id}`)
        .send(payloadBody)
        .expect(201, {
          data: {
            ...existingUser.toObject(),
            ...payloadBody,
          },
          message: 'updatedUser',
        });
    });

    describe('[PATCH] /v1/users - Update a users', () => {
      it('response statusCode 201 / updatedUser Success', async () => {
        const existingUser = await userModel.findOne();
        const payloadBody: UpdateUserDto = {
          name: 'test',
          status: 'deleted',
          role: ['user'],
        };

        return request(appInstance)
          .patch(`${userRoutePath}/${existingUser._id}`)
          .send(payloadBody)
          .expect(201, {
            data: {
              ...existingUser.toObject(),
              ...payloadBody,
            },
            message: 'updatedUser',
          });
      });

      it('response statusCode 400 / updatedUser Fail - User: invalid userId', async () => {
        const payloadBody: UpdateUserDto = {
          name: 'test',
          status: 'active',
          role: ['user'],
        };

        return request(appInstance)
          .patch(`${userRoutePath}/invalid-user-id`)
          .send(payloadBody)
          .expect(400, {
            response: {
              code: 400,
              message: 'User: invalid userId',
            },
          });
      });

      it('response statusCode 400 / updatedUser Fail - User: invalid userData', async () => {
        const existingUser = await userModel.findOne();
        const payloadBody: UpdateUserDto = {
          name: '',
          status: '',
          role: ['user'],
        };

        return request(appInstance)
          .patch(`${userRoutePath}/${existingUser._id}`)
          .send(payloadBody)
          .expect(400, {
            response: {
              code: 400,
              message: 'User: invalid userData',
            },
          });
      });

      it('response statusCode 409 / updatedUser Fail - User: user not found', async () => {
        const payloadBody: UpdateUserDto = {
          name: 'test',
          status: 'active',
          role: ['user'],
        };

        return request(appInstance)
          .patch(`${userRoutePath}/12312312321`)
          .send(payloadBody)
          .expect(409, {
            response: {
              code: 400,
              message: 'User: user not found',
            },
          });
      });
    });
  });

  describe('[DELETE] /v1/users - Delete a user', () => {
    it('response statusCode 201 / deletedUser Success', async () => {
      const existingUser = await userModel.findOne();
      if (!existingUser) throw new Error('No existing user found in the database');

      return request(appInstance).delete(`${userRoutePath}/${existingUser._id}`).expect(201, {
        data: existingUser.toObject(),
        message: 'deletedUser',
      });
    });

    it('response statusCode 400 / deletedUser Fail - User: invalid userId', async () => {
      return request(appInstance)
        .delete(`${userRoutePath}/invalid-user-id`)
        .expect(400, {
          response: {
            code: 400,
            message: 'User: invalid userId',
          },
        });
    });

    it('response statusCode 409 / deletedUser Fail - User: user not found', async () => {
      return request(appInstance)
        .delete(`${userRoutePath}/12312312321`)
        .expect(409, {
          response: {
            code: 400,
            message: 'User: user not found',
          },
        });
    });
  });
});
