import { Injectable, Logger } from '@nestjs/common';
import { CreateRecommendationDto } from './dtos/create-recommendation.dto';
import { UpdateRecommendationDto } from './dtos/update-recommendation.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserActionService } from '../user-action/user-action.service';
import { CarService } from '../car/car.service';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CarSortBy } from '../car/dtos/findMany.request.dto';
import { firstValueFrom } from 'rxjs';
import { UserPreferenceService } from '../user-preference/user-preference.service';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);
  private readonly recommendationApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userActionService: UserActionService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly carService: CarService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {
    this.recommendationApiUrl = this.configService.get<string>(
      'RECOMMENDATION_API_URL',
    );
  }

  async getRecommendedCars(userId: string, limit = 5): Promise<any> {
    const cacheKey = `recommendations:${userId}`;
    // Try to get from cache
    const cachedRecommendations = await this.redisClient.get(cacheKey);

    if (cachedRecommendations) {
      return JSON.parse(cachedRecommendations);
    }

    const preferences =
      await this.userPreferenceService.findManyByUserId(userId);

    // Get from recommendation service
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.recommendationApiUrl}/recommend`, {
          userId,
          limit,
          preferences: preferences.map((pref) => ({
            preference: pref.preference,
            weight: pref.weight,
          })),
        }),
      );

      await this.redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);

      return data;
    } catch (error) {
      this.logger.error(`Failed to get recommendations: ${error.message}`);
      return this.getPreferenceBasedFallbackRecommendations(
        userId,
        preferences,
        limit,
      );
    }
  }

  private async getPreferenceBasedFallbackRecommendations(
    userId: string,
    preferences: any[],
    limit: number,
  ) {
    // Extract make preferences
    const makePrefs = preferences
      .filter((p) => p.preference.startsWith('make:'))
      .sort((a, b) => b.weight - a.weight);

    // Extract category preferences
    const categoryPrefs = preferences
      .filter((p) => p.preference.startsWith('category:'))
      .sort((a, b) => b.weight - a.weight);

    // Use the strongest preference if available
    if (makePrefs.length > 0) {
      const make = makePrefs[0].preference.split(':')[1];
      const cars = await this.carService.findManyWithQuery({
        make,
        sortBy: CarSortBy.RATING,
        perPage: limit,
      });

      if (cars.cars.length > 0) {
        return cars;
      }
    }

    // Fall back to regular recommendations
    return this.getFallbackRecommendations(limit);
  }

  private async getFallbackRecommendations(limit: number) {
    const cars = await this.carService.findManyWithQuery({
      sortBy: CarSortBy.RATING,
      perPage: limit,
    });
    return cars;
  }
}
