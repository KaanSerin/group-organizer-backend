import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  roleId: number;
}

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class CreateGroupDto {
  @IsString()
  name: string;
}
