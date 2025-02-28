import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
