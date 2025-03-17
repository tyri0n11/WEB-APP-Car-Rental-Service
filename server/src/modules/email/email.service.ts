import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as pug from 'pug';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import { EmailDataInterface } from './interfaces/emailData.interface';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    Handlebars.registerHelper('formatCurrency', (value: number) => {
      if (typeof value !== 'number') {
        value = Number(value);
      }
      if (isNaN(value)) {
        return value;
      }
      return value.toLocaleString('en-US');
    });
  }

  private getHTML(template: string): string {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      `${template}.html`,
    );
    return fs.readFileSync(filePath, 'utf-8');
  }

  private renderHTML(template: string, context: object): string {
    const htmlTemplate = this.getHTML(template);
    const templateCompiled = Handlebars.compile(htmlTemplate);
    return templateCompiled(context);
  }

  private convertToHTML(template: string, context: object): string {
    const html = pug.renderFile(`src/templates/${template}.pug`, context);
    return html;
  }

  async sendEmail(data: EmailDataInterface): Promise<void> {
    await this.transporter.sendMail({
      from: data.from ?? 'noreply@example.com',
      ...data,
    });
  }
  async sendForgotPasswordEmail(
    name: string,
    email: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetPasswordLink = `${frontendUrl}/auth/reset-password?token=${token}`;
    console.log('resetPasswordLink', resetPasswordLink);
    await this.sendEmail({
      to: email,
      subject: 'Reset your password',
      html: this.convertToHTML('auth/forgotPassword', {
        email,
        name,
        resetPasswordLink,
      }),
    });
  }

  async sendVerifyEmail(
    email: string,
    fullName: string,
    token: string,
  ): Promise<void> {
    // const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    // const verificationLink = `${frontendUrl}/auth/verify-account?token=${token}`;
    const verificationLink = `http://${this.configService.get<string>('HOST')}:${this.configService.get('PORT')}/auth/verify-account?token=${token}`;
    const currentYear = new Date().getFullYear();
    await this.sendEmail({
      to: email,
      subject: 'Verify your account',
      html: this.convertToHTML('auth/verifyAccount', {
        verificationLink,
        fullName,
        currentYear,
      }),
    });
  }
}
