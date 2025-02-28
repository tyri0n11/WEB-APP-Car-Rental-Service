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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestWithUser } from '@/types/request.type';
import { ApiPagination } from '@/decorators/apiPagination.decorator';
import { FindManyByCarIdQueryDTO } from './dto/findManyByCarId.request.dto';
import { CreateReviewRequestDTO } from './dto/create.request.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createReviewDto: CreateReviewRequestDTO,
  ) {
    return this.reviewService.create(req.user.id, createReviewDto);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
