import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NEWSLETTER_MODEL_TOKEN } from '../../models/model-tokens';
import { Model } from 'mongoose';
import { NewsLetter } from '../../interfaces/newsletter.interface';
import { SubscribeUser } from '../../request-dtos/newletter-request';

@Injectable()
export class NewsletterService {

    constructor(
        @InjectModel(NEWSLETTER_MODEL_TOKEN) private readonly newsletterModel: Model<NewsLetter>,
    ) { }

    async subscribe(subscribeReq: SubscribeUser) {
        try {
            const newsLetter = new this.newsletterModel({
                firstName: subscribeReq.firstName,
                lastName: subscribeReq.lastName,
                email: subscribeReq.email
            });

            return await newsLetter.save();
        }
        catch (err) {
            console.log('Save Newsletter error:', err);
            throw err.code == 11000 ? 'This email already exists in our database' : err;
        }
    }
}
