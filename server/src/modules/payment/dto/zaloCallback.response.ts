import { BaseCallbackResponseDTO } from './baseCallback.response';

export class ZalopayCallbackResponseDTO extends BaseCallbackResponseDTO {
  response: {
    return_code: number;
    return_message: string;
  };
  success: boolean;
  bookingCode?: string;
}
