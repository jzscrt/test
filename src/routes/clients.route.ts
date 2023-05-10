import ClientController from '@controllers/clients.controller';
import { CreateUpdateClientDto } from '@dtos';
import { Route } from '@interfaces/routes.interface';
import { Router } from 'express';
import { validationMiddleware as validate } from '@middlewares/validation.middleware';

class ClientRoute implements Route {
  public path = '/clients';
  public router = Router();
  public clientController = new ClientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:clientId`, this.clientController.getClients);
    this.router.get(this.path, this.clientController.getClients);
    this.router.post(this.path, validate(CreateUpdateClientDto, 'body'), this.clientController.createClient);
    this.router.patch(`${this.path}/:clientId`, validate(CreateUpdateClientDto, 'body', true), this.clientController.updateClient);
    this.router.delete(`${this.path}/:clientId`, this.clientController.deleteClient);
  }
}

export default ClientRoute;
