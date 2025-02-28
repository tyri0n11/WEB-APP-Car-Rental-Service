import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewRequestDTO {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsInt()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
