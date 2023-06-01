import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserValidator {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  roleId: number;
}
