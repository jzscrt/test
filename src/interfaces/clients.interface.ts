import { ClientStatus } from '@enums';

export interface ClientName {
  first: string;
  middle?: string;
  last: string;
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
  aliasNames?: [ClientName];
  email: string;
  address: ClientAddress;
  altAddress?: [ClientAddress];
  dummyAccount?: [ClientDummyAccount];
  profession?: string;
  workload?: string;
  sfId?: string;
  staus: ClientStatus;
  dataBirth: Date;
  dateEnrollment: Date;
}
