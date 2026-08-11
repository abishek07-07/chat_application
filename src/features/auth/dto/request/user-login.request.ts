import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
