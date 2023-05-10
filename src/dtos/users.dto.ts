import { ArrayMinSize, IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unused-vars */

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @IsOptional()
  public status: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  public role: string[];
}

export class UpdateUserDto {
  @IsString()
  public name: string;

  @IsString()
  public status: string;

  @IsArray()
  @ArrayMinSize(1)
  public role: string[];
}
