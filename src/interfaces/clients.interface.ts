import { ClientStatus } from '@enums';

export interface ClientName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface ClientAddress {
  number: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ClientDummyAccount {
  username: string;
  password: string;
}

export interface Client {
  id: string;
  fullName: string;
  name: ClientName;
  aliasName?: [ClientName];
  email: string;
  altEmail?: [string];
  address: ClientAddress;
  altAddress?: [ClientAddress];
  phone: string;
  dummyAccount?: [ClientDummyAccount];
  profession?: string;
  workload?: string;
  sfId?: string;
  status: ClientStatus;
  dateBirth: Date;
  dateEnrollment: Date;
}
