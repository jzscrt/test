import ClientController from '@controllers/clients.controller';
import { CreateClientDto } from '@dtos';
import { Route } from '@interfaces/routes.interface';
import { Router } from 'express';
import { validationMiddleware as validate } from '@middlewares/validation.middleware';
import { authenticationMiddleware as auth } from '@middlewares/authentication.middleware';

class ClientRoute implements Route {
  public path = '/clients';
  public router = Router();
  public clientController = new ClientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}/:clientId`, auth(['client-o']), this.clientController.getClients);
    // this.router.get(this.path, auth(['client-r']), this.clientController.getClients);
    this.router.post(this.path, validate(CreateClientDto, 'body'), this.clientController.createClient);
    // this.router.patch(this.path, auth(['client-w']), this.clientController.updateClient);
    // this.router.delete(`${this.path}/:clientId`, auth(['client-x']), this.clientController.deleteClient);
  }
}

export default ClientRoute;
