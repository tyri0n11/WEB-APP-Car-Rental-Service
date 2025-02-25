import { BaseService } from '@/services/base/base.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Car } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CarResponseDTO } from './dto/response.dto';
import { UpdateCarRequestDTO } from './dto/update.request.dto';

@Injectable()
export class CarService extends BaseService<Car> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'car', CarResponseDTO);
  }

  async findById(id: string): Promise<CarResponseDTO> {}

  async update(id: string, dto: UpdateCarRequestDTO): Promise<CarResponseDTO> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }
    return await super.update({ id }, dto);
  }

  async delete(id: string): Promise<boolean> {
    const foundCar = await this.findOne({ id });
    if (!foundCar) {
      throw new BadRequestException('Car not found');
    }
    return await super.remove({ id });
  }
}
