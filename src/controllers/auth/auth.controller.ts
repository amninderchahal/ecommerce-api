import { Controller, Post, UsePipes, Body, Inject, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { LoginRequest, ResetPasswordRequest, TokenValidateRequest, ForgotPasswordRequest } from '../../request-dtos/auth-requests';
import { User } from '../../interfaces/user.interface';
import { EmailService } from '../../services/email/email.service';
import { Constants } from 'src/constants';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService
    ) { }

    @Post('login')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async login(@Body() credentials: LoginRequest) {
        try {
            const [user, token] = await this.authService.login(credentials.email, credentials.password);
            const expiresIn = new Date();
            expiresIn.setUTCHours(expiresIn.getUTCHours() + Constants.jwtOptions.expiresInHours);

            return {
                token: {
                    jwt: token,
                    expires: expiresIn.toISOString()
                },
                user: {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email.emailAddress
                }
            };
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    };

    @Post('password/reset')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async resetPassword(@Body() resetPwdReq: ResetPasswordRequest) {
        try {
            await this.authService.resetPassword(resetPwdReq);
            return { success: true };
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('password/forgot')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async forgotPassword(@Body() forgotPwdReq: ForgotPasswordRequest) {
        try {
            const user = await this.authService.forgotPassword(forgotPwdReq.email);
            await this.sendForgotPasswordEmail(user);
            return { success: true };
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('token/validate')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async validateToken(@Body() tokenValidateReq: TokenValidateRequest) {
        try {
            const authResponse = await this.authService.validateToken(tokenValidateReq.token);

            return ({
                id: authResponse.id,
                email: authResponse.email,
                role: authResponse.role,
                issuedAt: this.parseNumericDate(authResponse.iat).toISOString(),
                expires: this.parseNumericDate(authResponse.exp).toISOString()
            });
        } catch (err) {
            throw new HttpException(err, HttpStatus.UNAUTHORIZED);
        }
    }

    private async sendForgotPasswordEmail(user: User) {
        let subject = "Reset your password";
        let emailBody = {
            name: `${user.firstName} ${user.lastName}`,
            title: subject,
            text1: `This is an email for resetting your password. Please click the link given below to reset your password.`,
            hasLink: true,
            link: {
                href: `${process.env.WEBSITE_BASE_URL}/resetpassword?ct=${user.email._id}`,
                text: "Reset Password"
            }
        };

        try {
            await this.emailService.sendEmailWithHtmlTemplate(
                user.email.emailAddress,
                subject,
                emailBody
            );
        } catch (err) {
            console.log('Send forgot password email error', err);
            throw 'Unexpected error occurred while sending email.';
        }
    };

    private parseNumericDate(numeric) {
        const d = new Date(0);
        d.setUTCSeconds(numeric);
        return d;
    }
}
