import { IsNotEmpty, IsString } from 'class-validator';

export class SignupResponseDTO {
  @IsString()
  @IsNotEmpty()
  verifyAccountToken: string;
}
