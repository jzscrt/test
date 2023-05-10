import { IsArray, IsEmail, IsObject, IsOptional, IsString, IsDate } from 'class-validator';
import { ClientName, ClientAddress, ClientDummyAccount } from '@interfaces/clients.interface';
/* eslint-disable @typescript-eslint/no-unused-vars */

export class CreateClientDto {
  @IsString()
  public fullName: string;

  @IsObject()
  public name: ClientName;

  @IsArray()
  @IsOptional()
  public aliasNames: ClientName[];

  @IsEmail()
  public email: string;

  @IsObject()
  public address: ClientAddress;

  @IsObject()
  @IsOptional()
  public altAddress: ClientAddress[];

  @IsObject()
  @IsOptional()
  public dummyAccount: ClientDummyAccount[];

  @IsString()
  @IsOptional()
  public profession: string;

  @IsString()
  @IsOptional()
  public workload: string;

  @IsString()
  @IsOptional()
  public sfId: string;

  @IsString()
  public staus: string;

  @IsDate()
  public dataBirth: string;

  @IsDate()
  public dateEnrollment: string;
}
