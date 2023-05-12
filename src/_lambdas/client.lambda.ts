import ClientService from '@services/clients.service';
import { APIGatewayEvent, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { CreateUpdateClientDto } from '@dtos/clients.dto';
import { OK } from 'http-status';
import { Client } from '@interfaces/clients.interface';

const clientService = new ClientService();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function main(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> {
  const { httpMethod, pathParameters } = event;
  const { clientId } = pathParameters;
  const parsedBody = JSON.parse(event.body) as CreateUpdateClientDto;
  let data: Client | Client[];

  switch (httpMethod) {
    case 'POST':
      data = await clientService.createClient(parsedBody);
      break;

    case 'PATCH':
      data = await clientService.updateClient(clientId, parsedBody);
      break;

    case 'DELETE':
      data = await clientService.deleteClient(clientId);
      break;

    default:
      // GET HTTP Method Option
      data = clientId ? await clientService.findClientById(clientId) : await clientService.findAllClients();
      break;
  }

  return {
    body: JSON.stringify({ data, message: 'CLIENT: Successful lambda invocation' }),
    statusCode: OK,
  };
}
