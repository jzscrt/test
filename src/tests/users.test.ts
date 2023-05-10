import App from '../app';
import request from 'supertest';
import userModel from '../models/users.model';
import UserRoute from '../routes/users.route';
import { User } from '../interfaces/users.interface';

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

      return request(app).get(`/v1/${userRoute.path}`).expect(200, { data: allUsers, message: 'allUsers' });
    });
  });
});
