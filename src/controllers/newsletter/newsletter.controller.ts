import { Controller, Post, Body, HttpCode, HttpException, HttpStatus, Inject, UsePipes } from '@nestjs/common';
import { SubscribeUser } from '../../request-dtos/newletter-request';
import { NewsletterService } from '../../services/newletter/newletter.service';
import { ValidationPipe } from '../../pipes/validation.pipe';


@Controller('newsletter')
export class NewsletterController {
    constructor(
        private newsLetterService: NewsletterService
    ) { }

    @Post('subscribe')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async subscribe(@Body() subscribeReq: SubscribeUser) {
        try {
            const newUser = await this.newsLetterService.subscribe(subscribeReq);
            return ({
                _id: newUser._id,
            });
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}