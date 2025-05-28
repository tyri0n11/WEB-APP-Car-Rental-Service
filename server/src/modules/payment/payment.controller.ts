import { ApiPost } from '@/decorators/apiPost.decorator';
import { NoApplyResInterceptor } from '@/decorators/apiResponseMessage.decorator';
import { Body, Controller, Get, Injectable, Logger, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GatewayName } from './enums/gatewayName';
import { PaymentService } from './payment.service';
import { PaymentCallbackResponseDTO } from './dtos/callback.response.dto';

@Injectable()
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @ApiPost({ path: 'test/procress' })
  @ApiBody({
    type: Object,
    examples: {
      code: {
        value: {
          code: 'test1a_123213',
        },
      },
    },
  })
  async testCreatePaymentLink(@Body() data: any) {
    return this.paymentService.addTransactionToQueue(data.code);
  }
  @ApiExcludeEndpoint(true)
  @NoApplyResInterceptor()
  @ApiPost({ path: 'zalopay/callback' })
  async zalopayCallback(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    try {
      const result = await this.paymentService.handleCallback(GatewayName.ZALOPAY, {
        data: req.body,
        host: `${req.protocol}://${req.get('host')}`,
      });

      // Get the frontend URL from config
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        // Construct base redirect URL
      const status = result.success ? '1' : '0';
      const bookingCode = result.bookingCode || 'error';
      
      this.logger.log('Constructing redirect URL with:', {
        status,
        bookingCode,
        pointsEarned: result.pointsEarned,
        membershipLevel: result.membershipLevel
      });

      const redirectUrl = new URL(`${frontendUrl}/user/completed-booking/status/${status}/bookingcode/${bookingCode}`);
      
      // Add points information to redirect URL if payment was successful
      if (result.success && result.pointsEarned) {
        redirectUrl.searchParams.append('earnedPoints', String(result.pointsEarned));
        if (result.membershipLevel) {
          redirectUrl.searchParams.append('membershipLevel', result.membershipLevel);
        }
      }

      console.log('Redirecting to:', redirectUrl.toString());
      
      // Add cache control headers to prevent caching
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Redirect to the completed booking page
      return res.redirect(302, redirectUrl.toString());
    } catch (error) {
      console.error('Payment callback error:', error);
      // In case of error, redirect to completed booking page with error status
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const errorUrl = `${frontendUrl}/user/completed-booking/status/0/bookingcode/error`;
      return res.redirect(302, errorUrl);
    }
  }
}
