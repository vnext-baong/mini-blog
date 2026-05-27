import sgMail = require('@sendgrid/mail');
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('sendgrid.api_key') || '');
  }

  async sendMail(
    to: string | string[],
    subject: string,
    html: string,
    cc?: string | string[],
    bcc?: string | string[],
    attachments?: any,
  ) {
    try {
      const msg: sgMail.MailDataRequired = {
        to,
        from: {
          email: this.configService.get<string>('sendgrid.sender') || '',
          name: 'MiniBlog',
        },
        subject,
        html,
      };

      if (cc) msg.cc = cc;
      if (bcc) msg.bcc = bcc;
      if (attachments) msg.attachments = attachments;

      const res = await sgMail.send(msg);

      console.log('Email sent:', res[0].statusCode);
      return res;
    } catch (error: any) {
      console.error('Error occurred:', error);
      if (error.response) {
        console.error('SendGrid Error details:', JSON.stringify(error.response.body, null, 2));
      }
    }
  }
}
