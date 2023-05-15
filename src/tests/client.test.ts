import request from 'supertest';
import express, { NextFunction } from 'express';
import ClientController from '../controllers/clients.controller';
import { ClientService } from '../services/clients.service';
import { CreateUpdateClientDto } from '../dtos/clients.dto';
import { Client } from '../interfaces/clients.interface';
import { BAD_REQUEST, OK } from 'http-status';
import { ApiError } from '../_utils/apierror.util';

describe('ClientController', () => {
  let clientService: ClientService;
  let clientController: ClientController;

  beforeEach(() => {
    clientService = new ClientService();
    clientController = new ClientController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /clients', () => {
    let app: express.Express;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.post('/api/clients', (req, res, next) => clientController.createClient(req, res, next));
    });

    it('should create a new client', async () => {
      const clientData: CreateUpdateClientDto = {
        fullName: 'John Doe',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        email: 'johndoe@example.com',
        address: {
          number: '123',
          street: 'Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        phone: '1234567890',
        dateBirth: new Date('1990-01-01').toISOString(),
        dateEnrollment: new Date('2023-01-01').toISOString(),
        status: 'NOT_SET',
        aliasName: [
          {
            firstName: 'Johnny',
            lastName: 'Doe',
          },
        ],
        altEmail: ['johnnydoe@example.com'],
        altAddress: [
          {
            number: '124',
            street: 'Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
          },
        ],
        dummyAccount: [
          {
            username: 'johnnydoe',
            password: 'password',
          },
        ],
        profession: 'Software Engineer',
        workload: 'Full time',
        sfId: 'SF123',
      };

      // We mock the service function to resolve with some data
      const mockClient: Client = {
        id: '1',
        fullName: 'John Doe',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        email: 'johndoe@example.com',
        address: {
          number: '123',
          street: 'Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        phone: '1234567890',
        dateBirth: new Date('1990-01-01'),
        status: 'NOT_SET',
        dateEnrollment: new Date('2023-01-01'),
        aliasName: [
          {
            firstName: 'Johnny',
            lastName: 'Doe',
          },
        ],
        altEmail: ['johnnydoe@example.com'],
        altAddress: [
          {
            number: '124',
            street: 'Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
          },
        ],
        dummyAccount: [
          {
            username: 'johnnydoe',
            password: 'password',
          },
        ],
        profession: 'Software Engineer',
        workload: 'Full time',
        sfId: 'SF123',
      };

      jest.spyOn(clientService, 'createClient').mockResolvedValue(mockClient);

      const res = await request(app).post('/api/clients').send(clientData);

      expect(res.status).toBe(201);
      expect(res.body.data).toEqual(mockClient);
      expect(res.body.message).toBe('createdClient');
    });
    it('should return 400 if required fields are missing', async () => {
      const clientData: Partial<CreateUpdateClientDto> = {
        fullName: 'John Doe',
        // name is missing
        email: 'johndoe@example.com',
        address: {
          number: '123',
          street: 'Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        phone: '1234567890',
        dateBirth: new Date('1990-01-01').toISOString(),
      };

      const res = await request(app).post('/api/clients').send(clientData);

      expect(res.status).toBe(400);
      // expect some error message here
      expect(res.body.message).toBe('Error message');
    });
    it('should return 500 if the service throws an error', async () => {
      // Arrange
      const clientData: Partial<CreateUpdateClientDto> = {
        fullName: 'John Doe',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        email: 'johndoe@example.com',
        address: {
          number: '123',
          street: 'Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        phone: '1234567890',
        dateBirth: new Date('1990-01-01').toISOString(),
      };

      // Mock the service to throw an error
      jest.spyOn(clientService, 'createClient').mockImplementation(() => {
        throw new Error();
      });

      // Act
      const response = await request(app).post('/api/clients').send(clientData);

      // Assert
      expect(response.status).toBe(500);
    });
  });

  describe('UPDATE /clients/:clientId', () => {
    let app: express.Express;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.put('/api/clients/:clientId', (req, res, next) => clientController.updateClient(req, res, next));
    });

    interface CustomRequest {
      params: {
        clientId: string;
      };
      body: Partial<CreateUpdateClientDto>;
    }

    it('should update a client', async () => {
      const req: CustomRequest = {
        params: {
          clientId: 'someClientId',
        },
        body: {
          fullName: 'John Doe',
          name: {
            firstName: 'John',
            lastName: 'Doe',
          },
          email: 'johndoe@example.com',
          address: {
            number: '123',
            street: 'Main St',
            city: 'Townsville',
            state: 'TX',
            zip: '12345',
          },
          phone: '123-456-7890',
          dateBirth: new Date('1990-01-01').toISOString(),
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next: NextFunction = jest.fn();

      const mockClient: Client = {
        // fill this object with the updated client data that your service should return
        id: 'someClientId',
        fullName: 'John Doe',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        email: 'john@example.com',
        address: {
          number: '123',
          street: 'Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        phone: '1234567890',
        dateBirth: new Date('1990-01-01'),
        status: 'Not Set',
        dateEnrollment: new Date('2023-05-15T00:00:00.000Z'),
      };

      jest.spyOn(clientService, 'updateClient').mockResolvedValue(mockClient);

      const controller = new ClientController();
      await controller.updateClient(req as unknown as Request, res as unknown as Response, next);

      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockClient,
        message: 'updatedClient',
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const req: CustomRequest = {
        params: {
          clientId: 'someClientId',
        },
        body: {
          // fill this object with invalid client data (e.g., some required fields are missing)
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next: NextFunction = jest.fn();

      const controller = new ClientController();
      await controller.updateClient(req as unknown as Request, res as unknown as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect((next as jest.Mock).mock.calls[0][0].status).toEqual(BAD_REQUEST);
    });
    // Add more test cases as needed
  });

  describe('GET /clients/:clientId', () => {
    let app: express.Express;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.get('/api/clients/:clientId', (req, res, next) => clientController.updateClient(req, res, next));
    });

    it('should get a client', async () => {
      const req: Partial<Request> & { params: { clientId: string } } = {
        params: {
          clientId: 'someClientId',
        },
      };

      const mockClient: Partial<Client> = {
        id: 'someClientId',
        fullName: 'John Doe',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        email: 'johndoe@example.com',
        address: {
          number: '123',
          street: 'Main St',
          city: 'Townsville',
          state: 'TX',
          zip: '12345',
        },
        phone: '123-456-7890',
        dateBirth: new Date('1990-01-01'),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(ClientService.prototype, 'getClient').mockResolvedValue(mockClient);

      const next: NextFunction = jest.fn();

      await clientController.getClients(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('DELETE /clients/:clientId', () => {
    let app: express.Express;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.delete('/api/clients/:clientId', (req, res, next) => clientController.updateClient(req, res, next));
    });

    it('should delete a client', async () => {
      const req: Partial<Request> & { params: { clientId: string } } = {
        params: {
          clientId: 'someClientId',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(ClientService.prototype, 'deleteClient').mockResolvedValue();

      const next: NextFunction = jest.fn();

      await clientController.deleteClient(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Client deleted successfully' });
    });
  });
});
