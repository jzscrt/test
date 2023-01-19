import { UserRole, UserStatus } from '@enums';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole[];
  status?: UserStatus;
}
