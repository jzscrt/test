import { IsArray, IsEmail, IsObject, IsOptional, IsString, IsISO8601, IsPhoneNumber } from 'class-validator';
import { ClientName, ClientAddress, ClientDummyAccount } from '@interfaces/clients.interface';
/* eslint-disable @typescript-eslint/no-unused-vars */

export class CreateUpdateClientDto {
  @IsString()
  public fullName: string;

  @IsObject()
  public name: ClientName;

  @IsArray()
  @IsOptional()
  public aliasName: ClientName[];

  @IsEmail()
  public email: string;

  @IsArray()
  @IsOptional()
  altEmail: string[];

  @IsObject()
  public address: ClientAddress;

  @IsArray()
  @IsOptional()
  public altAddress: ClientAddress[];

  @IsPhoneNumber('US')
  public phone: string;

  @IsArray()
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
  public status: string;

  @IsISO8601()
  public dateBirth: string;

  @IsISO8601()
  public dateEnrollment: string;
}
