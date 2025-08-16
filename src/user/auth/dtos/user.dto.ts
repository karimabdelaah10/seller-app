import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserType } from '../../../../generated/prisma';

export class registerNewUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: string; // Assuming type is a string representing user role or type
}

export class loginUserDto {
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  password: string;
}
