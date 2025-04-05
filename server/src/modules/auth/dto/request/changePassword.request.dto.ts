import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordRequestDTO {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
