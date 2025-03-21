import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestWithUser } from '@/types/request.type';
import { ApiPagination } from '@/decorators/apiPagination.decorator';
import { FindManyByCarIdQueryDTO } from './dto/findManyByCarId.request.dto';
import { CreateReviewRequestDTO } from './dto/create.request.dto';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';

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

  @Get()
  @ApiPagination()
  findManyByCarId(@Query() query: FindManyByCarIdQueryDTO) {
    return this.reviewService.findManyByCarId(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findById(id);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
