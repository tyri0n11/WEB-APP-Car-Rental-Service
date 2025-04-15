import { RequestWithUser } from '@/types/request.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { CreateReviewRequestDTO } from './dtos/create.request.dto';
import { ReviewOwnerGuard } from './guards/reviewOwner.guard';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createReviewDto: CreateReviewRequestDTO,
  ) {
    return this.reviewService.createWithUserData(
      req.user.id,
      req.user.firstName,
      req.user.lastName,
      createReviewDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findById(id);
  }

  @UseGuards(JwtAccessGuard, ReviewOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
