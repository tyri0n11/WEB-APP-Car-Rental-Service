import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserOwnerGuard } from './guards/userOwner.guard';
import { RolesGuard } from '@/guards/role.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, UserOwnerGuard, RolesGuard],
  exports: [UserService],
})
export class UserModule {}
