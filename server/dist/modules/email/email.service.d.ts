import { ConfigService } from '@nestjs/config';
import { EmailDataInterface } from './interfaces/emailData.interface';
export declare class EmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    private getHTML;
    private renderHTML;
    private convertToHTML;
    sendEmail(data: EmailDataInterface): Promise<void>;
    sendUserResetPasswordEmail(email: string, token: string): Promise<void>;
    sendUserVerifyEmail(email: string, fullName: string, token: string): Promise<void>;
}
