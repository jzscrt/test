import ClientService from '@services/clients.service';
import { catchAsync } from '@utils/catchAsync.util';
import { CREATED, OK } from 'http-status';
import { CreateUpdateClientDto } from '@dtos/clients.dto';
import { NextFunction, Request, Response } from 'express';
import { Client } from '@interfaces/clients.interface';
/* eslint-disable @typescript-eslint/no-unused-vars */

class ClientController {
  public clientService = new ClientService();

  public getClients = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { clientId } = req.params;
    const findAllClients: Client[] | Client = clientId
      ? await this.clientService.findClientById(clientId)
      : await this.clientService.findAllClients();

    res.status(OK).json({ data: findAllClients, message: clientId ? 'getClient' : 'getAllClients' });
  });

  public createClient = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const clientData: CreateUpdateClientDto = req.body;
    const createClientData: Client = await this.clientService.createClient(clientData);

    res.status(CREATED).json({ data: createClientData, message: 'createdClient' });
  });

  public updateClient = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { clientId } = req.params;
    const clientData: CreateUpdateClientDto = req.body;
    const updateClientData: Client = await this.clientService.updateClient(clientId, clientData);

    res.status(OK).json({ data: updateClientData, message: 'updatedClient' });
  });

  public deleteClient = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { clientId } = req.params;
    const deleteClientData: Client = await this.clientService.deleteClient(clientId);

    res.status(OK).json({ data: deleteClientData, message: 'deletedClient' });
  });
}

export default ClientController;
