import App from './app';
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/users.route';
import ClientRoute from './routes/clients.route';

const app = new App([new UserRoute(), new AuthRoute(), new ClientRoute()]);
app.listen();
