import { ActionType } from '@prisma/client';

export class TrackUserActionDTO {
  userId: string;
  actionType: ActionType;
  carId?: string;
  metadata?: any;
  userLocation?: any;
}

export class TrackViewInterface {
  userId: string;
  carId: string;
  metadata: any;
}

export class TrackSearchInterface {
  userId: string;
  searchQuery: string;
  metadata: any;
}

export class TrackFavoriteInterface {
  userId: string;
  carId: string;
  metadata: any;
}

export class TrackBookInterface {
  userId: string;
  carId: string;
  metadata: any;
}
