import { IsBoolean, IsISO8601, IsJWT, IsMongoId, IsNumber, IsString } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unused-vars */

export class PackTokenDto {
  @IsMongoId()
  public sub: string;

  @IsNumber()
  public iat: number;

  @IsNumber()
  public exp: number;

  @IsString()
  public type: string;
}

export class CreateTokenDto {
  @IsJWT()
  public token: string;

  @IsMongoId()
  public user: string;

  @IsISO8601({ strict: true })
  public expires: string;

  @IsString()
  public type: string;

  @IsBoolean()
  public blacklisted: boolean;
}
