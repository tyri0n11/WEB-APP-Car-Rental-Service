import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CarSortBy } from '../dtos/findMany.request.dto';
import { CarStatus } from '@prisma/client';

export function ApiCarQueries() {
  return applyDecorators(
    ApiQuery({ name: 'q', required: false, type: String }),
    ApiQuery({ name: 'sortBy', required: false, enum: CarSortBy }),
    ApiQuery({ name: 'priceFrom', required: false, type: Number }),
    ApiQuery({ name: 'priceTo', required: false, type: Number }),
    ApiQuery({ name: 'make', required: false, type: String }),
    ApiQuery({ name: 'model', required: false, type: String }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: CarStatus,
    }),
    ApiQuery({
      name: 'categoryIds',
      required: false,
      type: String,
      description: 'Comma-separated category IDs',
    }),
    ApiQuery({ name: 'yearFrom', required: false, type: Number }),
    ApiQuery({ name: 'yearTo', required: false, type: Number }),
  );
}
