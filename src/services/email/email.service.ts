import { Injectable, Inject } from '@nestjs/common';
import { send, setApiKey } from '@sendgrid/mail';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { Constants } from 'src/constants';

@Injectable()
export class EmailService {
    constructor() {
        setApiKey(process.env.EMAIL_API_KEY);
    }
    
    sendEmail(to, subject, message) {
        const mail = {
            to: to,
            from: Constants.email.senderEmailaddress,
            subject: subject,
            text: message
        }

        return send(mail);
    }

    sendEmailWithHtmlTemplate = (to, subject, emailBody) => {
        let filename = path.resolve(__dirname, "../../templates/email.template.ejs");
        fs.readFile(filename, 'utf-8', (err, template) => {
            if (!err) {
                let html = ejs.render(template, { data: emailBody, websiteUrl: process.env.WEBSITE_BASE_URL });
                return this.sendEmailWithHtml(to, subject, html);
            }
            else {
                console.log(`Template read error for: ${filename}`, err);
            }
        });
    }

    private sendEmailWithHtml(to, subject, html) {
        const mail = {
            to: to,
            from: Constants.email.senderEmailaddress,
            subject: subject,
            html: html
        }

        return send(mail);
    }
}
