import UserService from '@services/users.service';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';

const userService = new UserService();

export const UsersLambda = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const { userId } = event.pathParameters;
  const parsedBody = event.body as any;
  let data: any;

  switch (action) {
    case 'findAllUsers':
      data = (await userService.findAllUsers()) as User[];
      break;

    case 'unfreeze':
      data = await userService.findUserById(userId);
      break;

    default:
      data = await equifaxService.checkStatus(parsedBody as CheckStatusDto);
      break;
  }

  return {
    body: JSON.stringify({ data, message: 'Successful lambda invocation' }),
    statusCode: 200,
  };
};
