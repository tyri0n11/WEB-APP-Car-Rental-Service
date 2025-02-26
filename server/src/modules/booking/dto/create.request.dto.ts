import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingRequestDTO {
  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsNotEmpty()
  @IsString()
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  returnAddress: string;

  @IsString()
  @IsNotEmpty()
  paymentGateway: string;

  @IsString()
  @IsNotEmpty()
  returnUrl: string;
}
