import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  description?: string;
  createdBy: number;
}

export class JoinGroupDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  groupId: number;
}

export class CreateGroupEventDto {
  @IsNotEmpty()
  groupId: number;

  @IsNotEmpty()
  name: string;

  @IsDateString()
  eventDate: Date;
}
