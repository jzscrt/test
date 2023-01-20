import App from '../app';
import request from 'supertest';
import userModel from '../models/users.model';
import UserRoute from '../routes/users.route';
import { User } from '../interfaces/users.interface';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users...', () => {
  describe('[GET] /v1/users - Get all users', () => {
    it('response statusCode 200 / allUsers Success', async () => {
      const users = userModel;
      const allUsers: User[] = await users.find();
      const userRoute = new UserRoute();
      const app = new App([userRoute]);

      return request(app).get(`/v1/${userRoute.path}`).expect(201, { data: allUsers, message: 'allUsers' });
    });
  });

  describe('[POST] /v1/users - Create a user', () => {
    it('response statusCode 201 / createdUser Success', async () => {
      const users = userModel;
      const lastInsertedUser: User[] = await users.find().sort({ _id: -1 });
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: CreateUserDto = {
        name: 'New account 1',
        email: 'newaccount@regalcredit.com',
        password: 'password',
        status: 'active',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}`).send(payloadBody).expect(201, {
        data: lastInsertedUser,
        message: 'createdUser',
      });
    });

    it('response statusCode 400 / createdUser Fail - Duplicate email', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: CreateUserDto = {
        name: 'New account 2',
        email: 'newaccount@regalcredit.com',
        password: 'password',
        status: 'active',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}`).send(payloadBody).expect(400, {
        message: 'User: Email address already exist!',
      });
    });

    it('response statusCode 400 / createdUser Fail - Empty request', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: CreateUserDto = {
        name: '',
        email: 'newaccount@regalcredit.com',
        password: 'password',
        status: '123456',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}`).send(payloadBody).expect(400, {
        message: 'User: invalid userData',
      });
    });
  });

  describe('[PATCH] /v1/users - Update a users', () => {
    it('response statusCode 201 / updatedUser Success', async () => {
      const users = userModel;
      const updatedUser: User[] = await users.find({ _id: '63ca44e502192ccf493403f7' });
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: UpdateUserDto = {
        name: 'test',
        status: 'deleted',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}/63ca44e502192ccf493403f7`).send(payloadBody).expect(201, {
        data: updatedUser,
        message: 'updatedUser',
      });
    });

    it('response statusCode 400 / updatedUser Fail - User: invalid userId', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: UpdateUserDto = {
        name: 'test',
        status: 'active',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}/`).send(payloadBody).expect(400, {
        message: 'User: invalid userId',
      });
    });

    it('response statusCode 400 / updatedUser Fail - User: invalid userData', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: UpdateUserDto = {
        name: '',
        status: '',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}/63ca44e502192ccf493403f7`).send(payloadBody).expect(400, {
        message: 'User: invalid userData',
      });
    });

    it('response statusCode 409 / updatedUser Fail - User: user not found', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);
      const payloadBody: UpdateUserDto = {
        name: 'test',
        status: 'active',
        role: ['user'],
      };

      return request(app).post(`/v1/${userRoute.path}/2351236512346`).send(payloadBody).expect(409, {
        message: 'User: user not found',
      });
    });
  });

  describe('[DELETE] /v1/users - Get all users', () => {
    it('response statusCode 201 / deletedUser Success', async () => {
      const users = userModel;
      const deletedUser: User[] = await users.find({ _id: '63ca44e502192ccf493403f7' });
      const userRoute = new UserRoute();
      const app = new App([userRoute]);

      return request(app).get(`/v1/${userRoute.path}/63ca44e502192ccf493403f7`).expect(201, { data: deletedUser, message: 'allUsers' });
    });

    it('response statusCode 400 / deletedUser Fail - User: invalid userId', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);

      return request(app).get(`/v1/${userRoute.path}`).expect(400, { message: 'User: invalid userId' });
    });

    it('response statusCode 409 / deletedUser Fail - User: User: user not found', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);

      return request(app).get(`/v1/${userRoute.path}/12312312321`).expect(409, { message: 'User: User: user not found' });
    });
  });
});
