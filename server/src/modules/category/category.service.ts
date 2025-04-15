import { BaseService } from '@/services/base/base.service';
import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { extend } from 'joi';
import { CategoryResponseDTO } from './dtos/response.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'category', CategoryResponseDTO);
  }
}
