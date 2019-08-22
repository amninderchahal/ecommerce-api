import { Controller, Post, UsePipes, Body, HttpException, HttpStatus, Inject, Get } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { AddUserRequest, ConfirmEmailRequest } from '../../request-dtos/user-requests';
import { EmailService } from '../../services/email/email.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService
    ) {}

    @Post('register')
    @UsePipes(ValidationPipe)
    async register(@Body() user: AddUserRequest){
        try {
            const newUser = await this.userService.register(user);
            return ({
                _id: newUser._id,
                email: newUser.email.emailAddress,
                name: `${newUser.firstName} ${newUser.lastName}`
            });
            // Don't send confirmation email for now
            // this.sendEmailConfirmation(newUser);
        } catch (err) {
            console.log('add user error', err);
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('email/confirm')
    @UsePipes(ValidationPipe)
    async confirmEmail(@Body() confirmEmailReq: ConfirmEmailRequest) {
        try {
            await this.userService.confirmEmail(confirmEmailReq.ct);
            return { success: true };
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    @Get('tags')
    async getTags() {
        try {
            return await this.userService.getTags();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    @Get('filters')
    async getFilters() {
        try {
            return await this.userService.getFilters();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    private async sendEmailConfirmation(newUser) {
        let subject = 'Welcome to eCommerce';
        let emailBody = {
            name: `${newUser.firstName} ${newUser.lastName}`,
            title: subject,
            text1: `This is a confirmation email that your account has been created with eCommerce. Please click the link given below to confirm this email address.`,
            text2: "Have fun and don't hesitate to contact us for any help",
            hasLink: true,
            link: {
                href: `${process.env.WEBSITE_BASE_URL}/?m=signin&ct=${newUser.email._id}`,
                text: 'Confirm email'
            }
        }

        try {
            await this.emailService.sendEmailWithHtmlTemplate(
                newUser.email.emailAddress,
                subject,
                emailBody
            );
        } catch (err) {
            console.log('Send email confirmation', err);
        }
    }
}
