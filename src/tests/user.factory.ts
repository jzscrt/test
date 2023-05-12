import { Factory } from 'rosie';
import { CreateUserDto } from '../dtos/user.dto';

const userFactory = new Factory()
  .sequence('name', (i: number) => `Test User ${i}`)
  .sequence('email', (i: number) => `test${i}@example.com`)
  .attr('password', 'password')
  .attr('status', 'active')
  .attr('role', ['user']);

export const createUserDto = (): CreateUserDto => {
  return userFactory.build();
};
