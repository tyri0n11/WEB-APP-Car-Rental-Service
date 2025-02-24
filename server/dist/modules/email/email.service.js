"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const pug = require("pug");
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        });
        Handlebars.registerHelper('formatCurrency', (value) => {
            if (typeof value !== 'number') {
                value = Number(value);
            }
            if (isNaN(value)) {
                return value;
            }
            return value.toLocaleString('en-US');
        });
    }
    getHTML(template) {
        const filePath = path.join(process.cwd(), 'src', 'templates', `${template}.html`);
        return fs.readFileSync(filePath, 'utf-8');
    }
    renderHTML(template, context) {
        const htmlTemplate = this.getHTML(template);
        const templateCompiled = Handlebars.compile(htmlTemplate);
        return templateCompiled(context);
    }
    convertToHTML(template, context) {
        const html = pug.renderFile(`src/templates/${template}.pug`, context);
        return html;
    }
    async sendEmail(data) {
        await this.transporter.sendMail({
            from: data.from ?? 'noreply@example.com',
            ...data,
        });
    }
    async sendUserResetPasswordEmail(email, token) {
        await this.sendEmail({
            to: email,
            subject: 'Reset your password',
            html: this.convertToHTML('auth/forgotPassword', { token }),
        });
    }
    async sendUserVerifyEmail(email, fullName, token) {
        const verificationLink = `${this.configService.get('HOST')}/auth/verify-account?token=${token}`;
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map