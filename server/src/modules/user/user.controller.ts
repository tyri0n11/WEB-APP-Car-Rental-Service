import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequestDTO } from './dto/update.request.dto';
import { UserOwnerGuard } from './guards/userOwner.guard';
import { Roles } from '@/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @UseGuards(UserOwnerGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateUserRequestDTO) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(UserOwnerGuard)
  async delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
