import App from './app';
import UserRoute from './routes/users.route';

const app = new App([new UserRoute()]);
app.listen();
