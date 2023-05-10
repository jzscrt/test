import clientModel from '@models/clients.model';
import { ApiError } from '@utils/apierror.util';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { CreateClientDto } from '@dtos/clients.dto';
import { isEmpty, isNotEmptyObject } from 'class-validator';
import { Client } from '@interfaces/clients.interface';

class ClientService {
  public clients = clientModel;

  // /**
  //  * Retrieves all Client objects from the database.
  //  *
  //  * @returns {Promise<Client[]>} - A promise that resolves to an array of Client objects.
  //  */
  // public async findAllClients(): Promise<Client[]> {
  //   const clients = await this.clients.find();
  //   return clients.map(client => client.toJSON()) as Client[];
  // }

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
   * @param {CreateClientDto} clientData - The data for the new Client object.
   * @returns {Promise<Client>} - A promise that resolves to the new Client object.
   */
  public async createClient(clientData: CreateClientDto): Promise<Client> {
    if (!isNotEmptyObject(clientData)) throw new ApiError(BAD_REQUEST, 'USER: invalid clientData');

    const createClient = await this.clients.create(clientData);

    return await this.findClientById(createClient.id);
  }

  // /**
  //  * Updates a Client object by its id.
  //  *
  //  * @param {string} clientId - The id of the Client object to update.
  //  * @param {CreateClientDto} clientData - The updated data for the Client object.
  //  * @returns {Promise<Client>} - A promise that resolves to the updated Client object.
  //  */
  // public async updateClient(clientId: string, clientData: CreateClientDto): Promise<Client> {
  //   if (isEmpty(clientId)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientId');
  //   if (isEmpty(clientData)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientData');

  //   const updateClientById: Client = await this.clients.findByIdAndUpdate(clientId, clientData);
  //   if (!updateClientById) throw new ApiError(NOT_FOUND, 'Client: client not found');

  //   const updatedClient = await this.findClientById(clientId);
  //   return updatedClient[0].toJSON() as Client;
  // }

  // /**
  //  * Deletes a Client object by its id.
  //  *
  //  * @param {number} clientId - The id of the Client object to delete.
  //  * @returns {Promise<Client>} - A promise that resolves to the updated Client object.
  //  */
  // public async deleteClient(clientId: string): Promise<Client> {
  //   if (isEmpty(clientId)) throw new ApiError(BAD_REQUEST, 'Client: invalid clientId');

  //   const deleteClientById = await this.clients.findByIdAndDelete(clientId);
  //   if (!deleteClientById) throw new ApiError(NOT_FOUND, 'Client: client not found');

  //   return deleteClientById.toJSON() as Client;
  // }

  // /**
  //  * Finds a client by email
  //  * @param email - The email of the client
  //  * @returns A promise that resolves to the client object if found, else it throws an error
  //  */
  // public async findClientByEmail(email: string): Promise<Client> {
  //   if (isEmpty(email)) throw new ApiError(BAD_REQUEST, 'USER: invalid email');

  //   const findClient = await this.clients.findOne({ email });
  //   if (!findClient) throw new ApiError(BAD_REQUEST, 'USER: does not exists');

  //   return findClient.toJSON() as Client;
  // }
}

export default ClientService;
export { ClientService };
