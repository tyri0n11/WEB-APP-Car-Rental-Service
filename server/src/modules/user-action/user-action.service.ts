import { BaseService } from '@/services/base/base.service';
import { Injectable } from '@nestjs/common';
import { ActionType, UserAction } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UserActionResponseDTO } from './dtos/user-action.response.dto';
import {
  TrackBookInterface,
  TrackFavoriteInterface,
  TrackSearchInterface,
  TrackUserActionDTO,
  TrackViewInterface,
} from './dtos/trackUserAction.dto';
import { UserPreferenceService } from '../user-preference/user-preference.service';
import { CarService } from '../car/car.service';

@Injectable()
export class UserActionService extends BaseService<UserAction> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly carService: CarService,
  ) {
    super(databaseService, 'userActions', UserActionResponseDTO);
  }

  async updatePreferencesFromAction(
    userId: string,
    carId: string,
    actionType: ActionType,
  ) {
    // Get car details
    const car = await this.carService.findById(carId);

    if (!car) return;

    let weight = 0.5; // Default weight

    switch (actionType) {
      case ActionType.VIEW_CAR:
        weight = 0.3;
        break;
      case ActionType.ADD_TO_FAVORITES:
        weight = 0.8;
        break;
      case ActionType.BOOK_CAR:
        weight = 0.9; // Strong signal
        break;
    }

    // Update preferences based on car attributes
    await this.userPreferenceService.updatePreference(
      userId,
      `make:${car.make}`,
      weight,
    );

    if (car.model) {
      await this.userPreferenceService.updatePreference(
        userId,
        `model:${car.model}`,
        weight,
      );
    }

    // Update category preferences
    for (const carCategory of car.categories) {
      await this.userPreferenceService.updatePreference(
        userId,
        `category:${carCategory.name}`,
        weight,
      );
    }
  }

  async trackAction(data: TrackUserActionDTO) {
    const { userId, carId, actionType, metadata, userLocation } = data;
    const action = await this.create({
      userId,
      actionType,
      ...(carId && { carId }),
      ...(metadata && { metadata }),
      ...(userLocation && { userLocation }),
    });

    if (
      actionType === ActionType.BOOK_CAR ||
      actionType === ActionType.ADD_TO_FAVORITES
    ) {
      await this.updatePreferencesFromAction(userId, carId, actionType);
    }

    return action;
  }

  trackBooking(data: TrackBookInterface) {
    const { userId, carId, metadata } = data;
    return this.trackAction({
      userId,
      carId,
      actionType: ActionType.BOOK_CAR,
      metadata,
    });
  }

  trackFavorite(data: TrackFavoriteInterface) {
    const { userId, carId, metadata } = data;
    return this.trackAction({
      userId,
      carId,
      actionType: ActionType.ADD_TO_FAVORITES,
      metadata,
    });
  }

  trackSearch(data: TrackSearchInterface) {
    const { userId, searchQuery, metadata } = data;
    return this.trackAction({
      userId,
      actionType: ActionType.SEARCH,
      metadata,
    });
  }

  trackView(data: TrackViewInterface) {
    const { userId, carId } = data;
    return this.trackAction({
      userId,
      carId,
      actionType: ActionType.VIEW_CAR,
    });
  }

  async findAllByUserId(userId: string) {
    return this.findMany({
      filter: {
        userId,
      },
      options: {
        include: {
          car: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    });
  }
}
