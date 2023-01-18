import App from './app';
import AnimalRoute from './routes/animals.route';

const app = new App([new AnimalRoute()]);
app.listen();
