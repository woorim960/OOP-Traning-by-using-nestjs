import { IsEmail, IsString, Matches } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{9,30}$/)
  password: string;
}
