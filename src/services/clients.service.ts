import clientModel from '@models/clients.model';
import { ApiError } from '@utils/apierror.util';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { CreateUpdateClientDto } from '@dtos/clients.dto';
import { isEmpty, isNotEmptyObject } from 'class-validator';
import { Client } from '@interfaces/clients.interface';

class ClientService {
  public clients = clientModel;

  /**
   * Retrieves all Client objects from the database.
   *
   * @returns {Promise<Client[]>} - A promise that resolves to an array of Client objects.
   */
  public async findAllClients(): Promise<Client[]> {
    const clients = await this.clients.find();
    return clients.map(client => client.toJSON()) as Client[];
  }

  /**
   * Retrieves a Client object by its id.
   *
   * @param {string} clientId - The id of the Client object to retrieve.
   * @returns {Promise<Client>} - A promise that resolves to the Client object.
   */
  public async findClientById(clientId: string): Promise<Client> {
    if (isEmpty(clientId)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientId');
    const findClient = await this.clients.findById(clientId);
    if (!findClient) throw new ApiError(NOT_FOUND, 'Client: client not found');

    return findClient.toJSON() as Client;
  }

  /**
   * Creates a new Client object in the database.
   *
   * @param {CreateUpdateClientDto} clientData - The data for the new Client object.
   * @returns {Promise<Client>} - A promise that resolves to the new Client object.
   */
  public async createClient(clientData: CreateUpdateClientDto): Promise<Client> {
    if (!isNotEmptyObject(clientData)) throw new ApiError(BAD_REQUEST, 'USER: invalid clientData');

    const createClient = await this.clients.create(clientData);

    return await this.findClientById(createClient.id);
  }

  /**
   * Updates a Client object by its id.
   *
   * @param {string} clientId - The id of the Client object to update.
   * @param {CreateUpdateClientDto} clientData - The updated data for the Client object.
   * @returns {Promise<Client>} - A promise that resolves to the updated Client object.
   */
  public async updateClient(clientId: string, clientData: CreateUpdateClientDto): Promise<Client> {
    if (isEmpty(clientId)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientId');
    if (isEmpty(clientData)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientData');

    const client = await this.findClientById(clientId);

    let updatedPayload = {};
    Array.from(['aliasName', 'altAddress', 'dummyAccount']).forEach(key => {
      updatedPayload[key] = JSON.parse(JSON.stringify(client[key]));
      clientData[key].forEach((item: object, idx: number) => {
        if (item['_id']) {
          const idxx = client[key].findIndex((i: object) => i['_id'].toString() === item['_id']);
          updatedPayload[key][idx] = { ...client[key][idxx], ...item };
        } else {
          updatedPayload[key].push(item);
        }
      });
    });

    updatedPayload = { ...client, ...clientData, ...updatedPayload };

    const updateClientById: Client = await this.clients.findByIdAndUpdate(clientId, updatedPayload);
    if (!updateClientById) throw new ApiError(NOT_FOUND, 'Client: client not found');

    const updatedClient = await this.findClientById(clientId);
    return updatedClient as Client;
  }

  /**
   * Deletes a Client object by its id.
   *
   * @param {number} clientId - The id of the Client object to delete.
   * @returns {Promise<Client>} - A promise that resolves to the updated Client object.
   */
  public async deleteClient(clientId: string): Promise<Client> {
    if (isEmpty(clientId)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientId');

    const deleteClientById = await this.clients.findByIdAndDelete(clientId);
    if (!deleteClientById) throw new ApiError(NOT_FOUND, 'Client: client not found');

    return deleteClientById.toJSON() as Client;
  }
}

export default ClientService;
export { ClientService };
