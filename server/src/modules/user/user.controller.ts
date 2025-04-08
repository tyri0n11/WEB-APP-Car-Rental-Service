import { RequestWithUser } from '@/types/request.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserRequestDTO } from './dtos/update.request.dto';
import { UserOwnerGuard } from './guards/userOwner.guard';
import { UserService } from './user.service';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { UpdateDrivingLicenseRequestDTO } from './dtos/update-driving-license.request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch('/update-profile')
  @UseGuards(JwtAccessGuard)
  async update(@Req() req: RequestWithUser, @Body() dto: UpdateUserRequestDTO) {
    return this.userService.updateProfile(req.user.id, dto);
  }

  @Patch('/update-driving-licence')
  @UseGuards(JwtAccessGuard)
  async updateDrivingLicence(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateDrivingLicenseRequestDTO,
  ) {
    return this.userService.updateDrivingLicence(req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  @UseGuards(UserOwnerGuard)
  async delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
