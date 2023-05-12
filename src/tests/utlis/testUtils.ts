import App from '../../app';
import UserRoute from '../../routes/user.route';

export const setupAppAndUserRoute = () => {
  const userRoute = new UserRoute();
  const app = new App([userRoute]);
  return { app, userRoute };
};
