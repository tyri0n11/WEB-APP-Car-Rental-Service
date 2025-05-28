import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // Đường dẫn đúng

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
