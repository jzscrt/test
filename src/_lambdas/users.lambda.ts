import UserService from '@services/users.service';
import { APIGatewayEvent, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { CreateUserDto } from '@dtos/users.dto';
import { OK } from 'http-status';
import { User } from '@interfaces/users.interface';

const userService = new UserService();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function main(event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> {
  const { httpMethod, pathParameters } = event;
  const { userId } = pathParameters;
  const parsedBody = JSON.parse(event.body) as CreateUserDto;
  let data: User | User[];

  switch (httpMethod) {
    case 'POST':
      data = await userService.createUser(parsedBody);
      break;

    case 'PATCH':
      data = await userService.updateUser(userId, parsedBody);
      break;

    case 'DELETE':
      data = await userService.deleteUser(userId);
      break;

    default:
      // GET HTTP Method Option
      data = userId ? await userService.findUserById(userId) : await userService.findAllUsers();
      break;
  }

  return {
    body: JSON.stringify({ data, message: 'USER: Successful lambda invocation' }),
    statusCode: OK,
  };
}
