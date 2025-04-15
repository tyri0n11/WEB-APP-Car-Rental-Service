import { BaseService } from '@/services/base/base.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Car, CarStatus, Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { CategoryService } from '../category/category.service';
import { DatabaseService } from '../database/database.service';
import { CreateCarRequestDTO } from './dtos/create.request.dto';
import { CarSortBy, FindManyCarsQueryDTO } from './dtos/findMany.request.dto';
import {
  CarResponseDTO,
  CarsWithPaginationResponseDTO,
} from './dtos/response.dto';

@Injectable()
export class CarService extends BaseService<Car> {
  private readonly logger = new Logger(CarService.name);
  private readonly defaultIncludes = {
    images: true,
    reviews: true,
    categories: {
      select: {
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

  private processCarResponse(car: any): CarResponseDTO {
    const { categories, images, ...rest } = car;
    const processedCategories = categories.map((cat) => ({
      id: cat.category.id,
      name: cat.category.name,
    }));
    return {
      ...rest,
      categories: processedCategories,
      images: images.map((img) => ({
        id: img.id,
        url: img.url,
        isMain: img.isMain,
      })),
    };
  }

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly categoryService: CategoryService,
  ) {
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
    const car = await super.create(
      {
        id: carId,
        ...carData,
        images: {
          create: imageUrls?.map((url, index) => ({
            url,
            isMain: index === 0,
          })),
        },
        categories: categoryIds && {
          create: categoryIds?.map((id) => ({
            categoryId: id,
          })),
        },
      },
      {
        include: this.defaultIncludes,
      },
    );

    return this.processCarResponse(car);
  }

  async findById(id: string): Promise<CarResponseDTO> {
    const car = await super.findOne({ id }, { include: this.defaultIncludes });
    if (!car) {
      throw new BadRequestException(`Car with ID ${id} not found`);
    }

    return this.processCarResponse(car);
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
      fuelType,
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
            categories: {
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
      ...(fuelType && { fuelType }),
      ...(yearFrom && { year: { gte: yearFrom } }),
      ...(yearTo && { year: { lte: yearTo } }),
    };

    const result = await super.findManyWithPagination({
      filter,
      orderBy: this.getSortOptions(sortBy),
      page,
      perPage,
      options: {
        include: {
          ...this.defaultIncludes,
        },
      },
    });

    const processedCars = result.data.map((car) =>
      this.processCarResponse(car),
    );

    return new CarsWithPaginationResponseDTO({
      cars: processedCars,
      pagination: {
        total: result.total,
        lastPage: result.lastPage,
        currentPage: result.currentPage,
        perPage: result.perPage,
        prev: result.prev,
        next: result.next,
      },
    });
  }

  async update(id: string, input: Prisma.CarUpdateInput): Promise<void> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }
    await super.update(id, input);
  }

  async updateStatus(id: string, status: CarStatus): Promise<void> {
    await this.update(id, { status });
  }

  async updateCategories(
    id: string,
    categoryIds: string[],
  ): Promise<CarResponseDTO> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }

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

    return await super.update(id, {
      categories: {
        deleteMany: {},
        create: categoryIds.map((id) => ({ categoryId: id })),
      },
    });
  }

  async updateImages(id: string, imageUrls: string[]): Promise<void> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }

    await super.update(id, {
      images: {
        deleteMany: {},
        create: imageUrls.map((url) => ({ url })),
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }
    return await super.remove({ id });
  }

  async setMainImage(id: string, imageId: string): Promise<void> {
    const car = await this.findById(id);

    await this.databaseService.carImage.updateMany({
      where: { id: car.id },
      data: { isMain: false },
    });

    await this.databaseService.carImage.update({
      where: { id: imageId },
      data: { isMain: true },
    });
  }

  async addToFavorite(userId: string, carId: string): Promise<void> {
    const [car, existingFavorite] = await Promise.all([
      this.findById(carId),
      this.databaseService.favoriteCar.findUnique({
        where: { userId_carId: { userId, carId } },
      }),
    ]);

    if (!car) {
      throw new BadRequestException('Car not found');
    }

    if (existingFavorite) {
      return;
    }

    await this.databaseService.favoriteCar.create({
      data: {
        userId,
        carId,
      },
    });
  }

  async removeFromFavorite(userId: string, carId: string): Promise<void> {
    const favoriteCar = await this.databaseService.favoriteCar.findUnique({
      where: { userId_carId: { userId, carId } },
    });
    if (!favoriteCar) {
      throw new BadRequestException('Car not found in favorites');
    }

    await this.databaseService.favoriteCar.delete({
      where: { id: favoriteCar.id },
    });
  }

  async getFavoriteCars(userId: string): Promise<CarResponseDTO[]> {
    const favoriteCars = await this.databaseService.car.findMany({
      where: { favoritedBy: { some: { userId } } },
      include: this.defaultIncludes,
    });

    const processedCars = favoriteCars.map((car) =>
      this.processCarResponse(car),
    );

    return processedCars;
  }
}
