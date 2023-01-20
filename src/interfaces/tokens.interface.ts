import { TokenType } from '@enums';

export interface Token {
  _id: string;
  token: string;
  user: string;
  type: TokenType;
  blacklisted: boolean;
}
