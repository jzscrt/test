import { TokenType } from '@enums';

export interface Token {
  id: string;
  token: string;
  user: string;
  type: TokenType;
  blacklisted: boolean;
}
