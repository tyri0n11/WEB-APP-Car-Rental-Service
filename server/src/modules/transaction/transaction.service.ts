import { BaseService } from '@/services/base/base.service';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { TransactionResponseDTO } from './dtos/response.dto';
import { CreateTransactionRequestDTO } from './dtos/create.request.dto';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'transaction', TransactionResponseDTO);
  }

  async create(
    dto: CreateTransactionRequestDTO,
  ): Promise<TransactionResponseDTO> {
    const transaction = await super.create({
      ...dto,
      paidAt: new Date(),
    });
    console.log('Created transaction data:', transaction); // Add this log
    return transaction;
  }
}
