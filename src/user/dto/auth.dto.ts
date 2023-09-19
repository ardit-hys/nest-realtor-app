import { UserType } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^(\+\d{1,2}\s?)?(\d{3})?[.\s-]?\d{3}[.\s-]?\d{4}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  // @IsEnum(UserType)
  // userType: UserType

  @IsOptional()
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class GenerateProdKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType
}
