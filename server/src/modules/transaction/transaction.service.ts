import { BaseService } from '@/services/base/base.service';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { TransactionResponseDTO } from './dto/response.dto';
import { CreateTransactionRequestDTO } from './dto/create.request.dto';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'transaction', TransactionResponseDTO);
  }
  create(dto: CreateTransactionRequestDTO): Promise<TransactionResponseDTO> {
    return super.create({
      ...dto,
      paidAt: new Date(),
    });
  }
}
