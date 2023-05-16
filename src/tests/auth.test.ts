import App from '../app';
import request from 'supertest';
import tokenModel from '../models/token.model';
import userModel from '../models/user.model';
import authRoute from '../routes/auth.route';
import { LoginAuthDto, LogoutAuthDto } from '../dtos/auth.dto';
import mongoose from 'mongoose';

const createUserDto = (name: string, email: string, password: string) => {
  return {
    name,
    email,
    password,
  };
};

const createLoginAuthDto = (email: string, password: string) => {
  return {
    email,
    password,
  };
};

afterAll(async () => {
  // Delete test users
  await userModel.deleteOne({ email: 'newaccount@regalcredit.com' });

  // Close the Mongoose connection
  await mongoose.disconnect();
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
      const payloadBody = createUserDto('New account 1', 'newaccount@regalcredit.com', 'password');

      return request(app.app)
        .post(`/v1/${authRoutes.path}/signup`)
        .send(payloadBody)
        .expect(201, { data: { user: lastInsertedUser, tokenCreated }, message: 'created' });
    });

    it('response statusCode 400 / created Fail - Invalid user data', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody = createUserDto('', 'newaccount@regalcredit.com', 'password');

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
      const payloadBody = createUserDto('New account 2', 'newaccount@regalcredit.com', 'password');

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
      const payloadBody: LoginAuthDto = createLoginAuthDto('newaccount@regalcredit.com', 'password');

      return request(app.app)
        .post(`/v1/${authRoutes.path}/login`)
        .send(payloadBody)
        .expect(201, { data: { user: loginUser, tokenCreated }, message: 'logged in' });
    });

    it('response statusCode 400 / Login Fail - Invalid user data', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LoginAuthDto = createLoginAuthDto('', 'password');

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
      const payloadBody: LoginAuthDto = createLoginAuthDto('notexistingaccount@regalcredit.com', 'password');

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
      const payloadBody: LoginAuthDto = createLoginAuthDto('newaccount@regalcredit.com', 'notitspassword');

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
      const loginUser = await users.findOne({ email: 'newaccount@regalcredit.com' });
      const tokens = tokenModel;
      const tokenCreated = await tokens.findOne({ user: loginUser['_id'] });

      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LogoutAuthDto = createLoginAuthDto(tokenCreated.refreshToken, tokenCreated.accessToken);

      return request(app.app).post(`/v1/${authRoutes.path}/logout`).send(payloadBody).expect(200, { message: 'logged out' });
    });

    it('response statusCode 400 / Logout Fail - Invalid token data', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LogoutAuthDto = createLoginAuthDto('', 'invalidAccessToken');

      return request(app.app)
        .post(`/v1/${authRoutes.path}/logout`)
        .send(payloadBody)
        .expect(400, {
          response: {
            code: 400,
            message: 'AUTH: invalid tokenData',
          },
        });
    });

    it('response statusCode 404 / Logout Fail - Token not found', async () => {
      const authRoutes = new authRoute();
      const app = new App([authRoutes]);
      const payloadBody: LogoutAuthDto = createLoginAuthDto('nonExistingRefreshToken', 'nonExistingAccessToken');

      return request(app.app)
        .post(`/v1/${authRoutes.path}/logout`)
        .send(payloadBody)
        .expect(404, {
          response: {
            code: 404,
            message: 'AUTH: token not found',
          },
        });
    });
  });
});
