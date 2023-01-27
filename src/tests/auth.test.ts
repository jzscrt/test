import App from '../app';
import request from 'supertest';
import tokenModel from '../models/tokens.model';
import userModel from '../models/users.model';
import authRoute from '../routes/auth.route';
import { LoginAuthDto, LogoutAuthDto } from '../dtos/auth.dto';
import { Token } from 'aws-cdk-lib';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth...', () => {
  describe('[POST] /v1/signup - Signup a user', () => {
    it('response statusCode 200 / created Success', async () => {
      const users = userModel;
      const lastInsertedUser = await users.find().sort({ _id: -1 });
      const tokens = tokenModel;
      const tokenCreated = await tokens.find({ user: lastInsertedUser['id'] });

      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        name: 'New account 1',
        email: 'newaccount@regalcredit.com',
        password: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/signup`)
        .send(payloadBody)
        .expect(201, { data: { user: lastInsertedUser, tokenCreated }, message: 'created' });
    });

    it('response statusCode 400 / created Fail - Invalid user data', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        name: '',
        email: 'newaccount@regalcredit.com',
        password: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/signup`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 400,
            message: 'User: invalid userData',
          },
        });
    });

    it('response statusCode 400 / created Fail - Duplicate email', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        name: 'New account 2',
        email: 'newaccount@regalcredit.com',
        password: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/signup`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 400,
            message: `USER: email ${payloadBody.email} already exists`,
          },
        });
    });
  });

  describe('[POST] /v1/login - Login a user', () => {
    it('response statusCode 200 / logged in Success', async () => {
      const users = userModel;
      const loginUser = await users.find({ email: 'newaccount@regalcredit.com' });
      const tokens = tokenModel;
      const tokenCreated = await tokens.find({ user: loginUser['user'] });

      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LoginAuthDto = {
        email: 'newaccount@regalcredit.com',
        password: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/login`)
        .send(payloadBody)
        .expect(201, { data: { user: loginUser, tokenCreated }, message: 'logged in' });
    });

    it('response statusCode 400 / Login Fail - Invalid user data', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LoginAuthDto = {
        email: '',
        password: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/login`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 400,
            message: 'AUTH: invalid userData',
          },
        });
    });

    it('response statusCode 404 / Login Fail - User not found', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        email: 'notexistingaccount@regalcredit.com',
        password: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/login`)
        .send(payloadBody)
        .expect(404, {
          response: {
            code: 404,
            message: 'AUTH: user not found',
          },
        });
    });

    it('response statusCode 400 / Login Fail - password did not match', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        email: 'newaccount@regalcredit.com',
        password: 'notitspassword',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/login`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 400,
            message: 'AUTH: password did not match',
          },
        });
    });
  });

  describe('[POST] /v1/logout - Logout a user', () => {
    it('response statusCode 200 / logged out Success', async () => {
      const users = userModel;
      const loginUser = await users.find({ email: 'newaccount@regalcredit.com' });
      const tokens = tokenModel;
      const tokenCreated = await tokens.find({ user: loginUser['user'] });

      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LogoutAuthDto = {
        refreshToken: 'newaccount@regalcredit.com',
        accessToken: 'password',
      };

      return request(app.app)
        .post(`/v1/${authRoutes.path}/login`)
        .send(payloadBody)
        .expect(201, { data: { user: loginUser, tokenCreated }, message: 'logged out' });
    });

    it('response statusCode 400 / Login Fail - Invalid user data', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LogoutAuthDto = {
        refreshToken: 'newaccount@regalcredit.com',
        accessToken: 'password',
      };

      return request(app.app).post(`/v1/${authRoutes.path}/login`).send(payloadBody).expect(400, {
        message: 'AUTH: invalid userData',
      });
    });

    it('response statusCode 404 / Login Fail - User not found', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        email: 'notexistingaccount@regalcredit.com',
        password: 'password',
      };

      return request(app.app).post(`/v1/${authRoutes.path}/login`).send(payloadBody).expect(404, {
        message: 'AUTH: user not found',
      });
    });

    it('response statusCode 400 / Login Fail - password did not match', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = {
        email: 'newaccount@regalcredit.com',
        password: 'notitspassword',
      };

      return request(app.app).post(`/v1/${authRoutes.path}/login`).send(payloadBody).expect(400, {
        message: 'AUTH: password did not match',
      });
    });
  });
});
