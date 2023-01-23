import { IsEmail, IsJWT, IsString } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unused-vars */

export class LoginAuthDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class LogoutAuthDto {
  @IsJWT()
  public refreshToken: string;

  @IsJWT()
  public accessToken: string;
}
