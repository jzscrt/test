import App from './app';
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/users.route';

const app = new App([new UserRoute(), new AuthRoute()]);
app.listen();
