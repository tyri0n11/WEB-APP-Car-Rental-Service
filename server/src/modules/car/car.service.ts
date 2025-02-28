import { BaseService } from '@/services/base/base.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CarResponseDTO } from './dto/response.dto';
import { UpdateCarRequestDTO } from './dto/update.request.dto';
import { CreateCarRequestDTO } from './dto/create.request.dto';
import { CarSortBy, FindManyCarsQueryDTO } from './dto/findMany.request.dto';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

@Injectable()
export class CarService extends BaseService<Car> {
  private readonly defaultIncludes = {
    images: true,
    reviews: true,
    carCategories: {
      include: {
        category: true,
      },
    },
  };
  private genCarId(): string {
    const now = dayjs().format('YYMMDD').toString();
    const randomNumber = crypto
      .randomInt(0, 10000000000)
      .toString()
      .padStart(10, '0');
    return now + randomNumber;
  }
  private getSortOptions(sortBy?: CarSortBy) {
    switch (sortBy) {
      case CarSortBy.PRICE_ASC:
        return { dailyPrice: 'asc' };
      case CarSortBy.PRICE_DESC:
        return { dailyPrice: 'desc' };
      case CarSortBy.RATING:
        return {
          reviews: {
            _avg: {
              rating: 'desc',
            },
          },
        };
      case CarSortBy.NEWEST:
        return { createdAt: 'desc' };
      case CarSortBy.OLDEST:
        return { createdAt: 'asc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'car', CarResponseDTO);
  }

  async create(dto: CreateCarRequestDTO): Promise<CarResponseDTO> {
    const { imageUrls, categoryIds, ...carData } = dto;
    if (categoryIds && categoryIds.length > 0) {
      const foundCategories = await this.databaseService.category.findMany({
        where: {
          id: {
            in: categoryIds,
          },
        },
      });

      if (foundCategories.length !== categoryIds.length) {
        const foundIds = foundCategories.map((cat) => cat.id);
        const notFoundIds = categoryIds.filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Categories not found: ${notFoundIds.join(', ')}`,
        );
      }
    }
    const carId = this.genCarId();
    return await super.create(
      {
        id: carId,
        ...carData,
        images: {
          create: imageUrls?.map((url, index) => ({
            url,
            isMain: index === 0,
          })),
        },
        carCategories: categoryIds && {
          create: categoryIds?.map((id) => ({
            categoryId: id,
          })),
        },
      },
      {
        include: this.defaultIncludes,
      },
    );
  }

  async findById(
    id: string,
    include?: Prisma.CarInclude,
  ): Promise<CarResponseDTO> {
    const car = await super.findOne({ id }, { include });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return car;
  }

  async findManyWithQuery(query: FindManyCarsQueryDTO) {
    const {
      q,
      sortBy,
      page,
      perPage,
      priceFrom,
      priceTo,
      make,
      model,
      status,
      yearFrom,
      yearTo,
    } = query;

    const filter: Prisma.CarWhereInput = {
      ...(q && {
        OR: [
          { make: { contains: q, mode: 'insensitive' } },
          { model: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { licensePlate: { contains: q, mode: 'insensitive' } },
          {
            carCategories: {
              some: {
                category: {
                  name: { contains: q, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      }),
      ...(priceFrom && { dailyPrice: { gte: priceFrom } }),
      ...(priceTo && { dailyPrice: { lte: priceTo } }),
      ...(make && { make: { contains: make, mode: 'insensitive' } }),
      ...(model && { model: { contains: model, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(yearFrom && { year: { gte: yearFrom } }),
      ...(yearTo && { year: { lte: yearTo } }),
    };

    return super.findManyWithPagination({
      filter,
      orderBy: this.getSortOptions(sortBy),
      page,
      perPage,
      options: {
        include: {
          images: {
            where: { isMain: true },
            take: 1,
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          carCategories: {
            include: {
              category: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateCarRequestDTO): Promise<CarResponseDTO> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }
    const { imageUrls, categoryIds, ...updateData } = dto;

    if (categoryIds?.length > 0) {
      const foundCategories = await this.databaseService.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true },
      });

      if (foundCategories.length !== categoryIds.length) {
        const foundIds = foundCategories.map((cat) => cat.id);
        const notFoundIds = categoryIds.filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Categories not found: ${notFoundIds.join(', ')}`,
        );
      }
    }

    return super.update(
      { id },
      {
        ...updateData,
        ...(imageUrls && {
          images: {
            deleteMany: {},
            create: imageUrls.map((url, index) => ({
              url,
              isMain: index === 0,
            })),
          },
        }),
        ...(categoryIds && {
          carCategories: {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        }),
      },
      {
        include: this.defaultIncludes,
      },
    );
  }

  async delete(id: string): Promise<boolean> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }
    return await super.remove({ id });
  }

  async setMainImage(id: string, imageId: string): Promise<CarResponseDTO> {
    const car = await this.findById(id);

    await this.databaseService.carImage.updateMany({
      where: { id: car.id },
      data: { isMain: false },
    });

    await this.databaseService.carImage.update({
      where: { id: imageId },
      data: { isMain: true },
    });

    return this.findById(id);
  }
}
